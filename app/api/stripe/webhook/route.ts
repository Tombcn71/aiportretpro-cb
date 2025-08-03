import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      console.log("🎉 Payment completed:", session.id)

      // Check if this session was already processed
      const existingPurchase = await sql`
        SELECT id FROM purchases WHERE stripe_session_id = ${session.id}
      `

      if (existingPurchase.length > 0) {
        console.log("⚠️ Session already processed:", session.id)
        return NextResponse.json({ received: true })
      }

      const wizardSessionId = session.metadata?.wizardSessionId
      const projectName = session.metadata?.projectName || ""
      const gender = session.metadata?.gender || ""
      const userEmail = session.metadata?.userEmail || session.customer_details?.email || ""
      const photoCount = Number.parseInt(session.metadata?.photoCount || "0")

      console.log("📋 Processing payment:", {
        wizardSessionId,
        projectName,
        gender,
        userEmail,
        photoCount,
      })

      // Get wizard data
      let wizardData = null
      try {
        const wizardResult = await sql`
          SELECT * FROM wizard_sessions WHERE session_id = ${wizardSessionId}
        `
        if (wizardResult.length > 0) {
          wizardData = wizardResult[0]
        }
      } catch (error) {
        console.log("⚠️ Could not fetch wizard data:", error)
      }

      const uploadedPhotos = wizardData?.uploaded_photos || []

      // Create purchase record
      const purchaseResult = await sql`
        INSERT INTO purchases (
          stripe_session_id,
          user_email,
          amount,
          currency,
          status,
          created_at
        ) VALUES (
          ${session.id},
          ${userEmail},
          ${session.amount_total || 0},
          ${session.currency || "eur"},
          'completed',
          NOW()
        )
        RETURNING id
      `

      const purchaseId = purchaseResult[0].id

      // Create project
      const projectResult = await sql`
        INSERT INTO projects (
          user_email,
          name,
          gender,
          uploaded_photos,
          status,
          purchase_id,
          created_at,
          updated_at
        ) VALUES (
          ${userEmail},
          ${projectName},
          ${gender},
          ${Array.isArray(uploadedPhotos) ? uploadedPhotos : []},
          'processing',
          ${purchaseId},
          NOW(),
          NOW()
        )
        RETURNING id
      `

      const projectId = projectResult[0].id

      console.log("✅ Project created:", projectId)

      // Start Astria training with pack 928
      try {
        const astriaResponse = await fetch("https://api.astria.ai/tunes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tune: {
              title: `${projectName} - ${gender}`,
              name: projectName.toLowerCase().replace(/[^a-z0-9]/g, ""),
              callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${projectId}`,
            },
            pack_id: 928,
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
          SET tune_id = ${astriaData.id}, updated_at = NOW()
          WHERE id = ${projectId}
        `

        // Upload photos to Astria
        if (Array.isArray(uploadedPhotos) && uploadedPhotos.length > 0) {
          for (const photoUrl of uploadedPhotos) {
            try {
              await fetch(`https://api.astria.ai/tunes/${astriaData.id}/images`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  image: { url: photoUrl },
                }),
              })
            } catch (photoError) {
              console.error("❌ Failed to upload photo:", photoError)
            }
          }
        }

        console.log("✅ All photos uploaded to Astria")
      } catch (astriaError) {
        console.error("❌ Astria training failed:", astriaError)

        // Update project status to failed
        await sql`
          UPDATE projects 
          SET status = 'failed', updated_at = NOW()
          WHERE id = ${projectId}
        `
      }

      // Clean up wizard session
      try {
        await sql`DELETE FROM wizard_sessions WHERE session_id = ${wizardSessionId}`
      } catch (cleanupError) {
        console.log("⚠️ Wizard session cleanup failed:", cleanupError)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
