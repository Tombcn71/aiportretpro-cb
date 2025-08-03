import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { sql } from "@/lib/db"
import { getWizardData, deleteWizardData } from "@/app/api/wizard/save-data/route"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const { wizardSessionId, userEmail } = session.metadata || {}

      console.log("🎉 Payment completed for wizard session:", wizardSessionId)

      if (!wizardSessionId || !userEmail) {
        console.error("❌ Missing metadata in webhook")
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }

      // Get wizard data
      const wizardData = getWizardData(wizardSessionId)
      if (!wizardData) {
        console.error("❌ Wizard data not found for session:", wizardSessionId)
        return NextResponse.json({ error: "Wizard data not found" }, { status: 404 })
      }

      const { projectName, gender, uploadedPhotos } = wizardData

      // Create project in database
      const projectResult = await sql`
        INSERT INTO projects (
          user_email,
          name,
          status,
          created_at,
          updated_at,
          stripe_session_id,
          pack_id
        ) VALUES (
          ${userEmail},
          ${projectName},
          'processing',
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP,
          ${session.id},
          928
        )
        RETURNING id
      `

      const projectId = projectResult[0].id

      console.log("✅ Project created with ID:", projectId)

      // Start Astria training
      try {
        const astriaResponse = await fetch("https://api.astria.ai/tunes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tune: {
              title: `${projectName.replace(/[^a-zA-Z0-9\s]/g, "").substring(0, 30)}_${projectId}`,
              name: gender === "male" ? "man" : "woman",
              branch: "fast",
              token: "ohwx",
              base_tune_id: null,
              image_urls: uploadedPhotos,
              callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${projectId}`,
            },
          }),
        })

        if (!astriaResponse.ok) {
          throw new Error(`Astria API error: ${astriaResponse.status}`)
        }

        const astriaData = await astriaResponse.json()
        console.log("🚀 Astria training started:", astriaData.id)

        // Update project with tune_id
        await sql`
          UPDATE projects 
          SET tune_id = ${astriaData.id}
          WHERE id = ${projectId}
        `

        // Clean up wizard data
        deleteWizardData(wizardSessionId)

        console.log("✅ Wizard flow completed successfully")
      } catch (astriaError) {
        console.error("❌ Astria training failed:", astriaError)

        // Update project status to failed
        await sql`
          UPDATE projects 
          SET status = 'failed'
          WHERE id = ${projectId}
        `
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
