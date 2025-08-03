import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"
import { getWizardData, deleteWizardData } from "../../wizard/save-data/route"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      console.log("❌ No Stripe signature")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.log("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("🎯 Stripe webhook event:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      console.log("💳 Payment completed for session:", session.id)
      console.log("📋 Session metadata:", session.metadata)

      const wizardSessionId = session.metadata?.wizardSessionId
      if (!wizardSessionId) {
        console.log("❌ No wizard session ID in metadata")
        return NextResponse.json({ error: "No wizard session ID" }, { status: 400 })
      }

      // Get wizard data
      const wizardData = getWizardData(wizardSessionId)
      if (!wizardData) {
        console.log("❌ No wizard data found for session:", wizardSessionId)
        return NextResponse.json({ error: "No wizard data found" }, { status: 400 })
      }

      console.log("✅ Found wizard data:", {
        projectName: wizardData.projectName,
        gender: wizardData.gender,
        photoCount: wizardData.uploadedPhotos.length,
      })

      try {
        // Create project in database
        const projectResult = await sql`
          INSERT INTO projects (
            user_email, 
            project_name, 
            gender, 
            uploaded_photos, 
            status, 
            stripe_session_id,
            created_at,
            updated_at
          )
          VALUES (
            ${session.customer_email},
            ${wizardData.projectName},
            ${wizardData.gender},
            ${sql.array(wizardData.uploadedPhotos, "text")},
            'processing',
            ${session.id},
            NOW(),
            NOW()
          )
          RETURNING id
        `

        const projectId = projectResult[0].id
        console.log("✅ Project created with ID:", projectId)

        // Start Astria training
        const astriaResponse = await fetch("https://api.astria.ai/tunes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tune: {
              title: `${wizardData.projectName} - ${wizardData.gender}`,
              name: `project_${projectId}`,
              image_urls: wizardData.uploadedPhotos,
              callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${projectId}`,
            },
          }),
        })

        if (!astriaResponse.ok) {
          const errorText = await astriaResponse.text()
          console.log("❌ Astria training failed:", errorText)
          throw new Error(`Astria training failed: ${errorText}`)
        }

        const astriaData = await astriaResponse.json()
        console.log("✅ Astria training started:", astriaData.id)

        // Update project with tune ID
        await sql`
          UPDATE projects 
          SET tune_id = ${astriaData.id}
          WHERE id = ${projectId}
        `

        // Clean up wizard data
        deleteWizardData(wizardSessionId)
        console.log("🧹 Wizard data cleaned up")

        return NextResponse.json({ success: true })
      } catch (error) {
        console.error("❌ WEBHOOK ERROR:", error)
        return NextResponse.json({ error: "Processing failed" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
