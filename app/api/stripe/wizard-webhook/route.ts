import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"
import { getWizardData, deleteWizardData } from "../../wizard/save-data/route"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("🎯 Stripe webhook received:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Check if this is a wizard purchase
      if (session.metadata?.type === "wizard_purchase") {
        console.log("🧙‍♂️ Processing wizard purchase:", session.metadata)

        const wizardSessionId = session.metadata.wizard_session_id
        const userEmail = session.metadata.user_email || session.customer_email

        // Get wizard data
        const wizardData = getWizardData(wizardSessionId)

        if (!wizardData) {
          console.error("❌ Wizard data not found for session:", wizardSessionId)
          return NextResponse.json({ error: "Wizard data not found" }, { status: 404 })
        }

        try {
          // Create project in database
          const projectResult = await sql`
            INSERT INTO projects (
              user_email,
              name,
              gender,
              status,
              stripe_session_id,
              created_at,
              updated_at
            ) VALUES (
              ${userEmail},
              ${wizardData.projectName},
              ${wizardData.gender},
              'payment_completed',
              ${session.id},
              NOW(),
              NOW()
            )
            RETURNING id
          `

          const projectId = projectResult[0].id
          console.log("✅ Project created with ID:", projectId)

          // Start Astria training
          const astriaResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/projects/create-with-pack`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId,
              projectName: wizardData.projectName,
              gender: wizardData.gender,
              uploadedPhotos: wizardData.uploadedPhotos,
              userEmail,
            }),
          })

          if (astriaResponse.ok) {
            console.log("✅ Astria training started for project:", projectId)

            // Update project status
            await sql`
              UPDATE projects 
              SET status = 'training_started', updated_at = NOW()
              WHERE id = ${projectId}
            `
          } else {
            console.error("❌ Failed to start Astria training")
          }

          // Clean up wizard data
          deleteWizardData(wizardSessionId)

          console.log("🎉 Wizard purchase completed successfully")
        } catch (error) {
          console.error("❌ Error processing wizard purchase:", error)
          return NextResponse.json({ error: "Processing failed" }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
