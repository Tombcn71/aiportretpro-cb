import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const { userId, wizardSessionId, projectName, gender, uploadedFiles } = session.metadata!

      try {
        // Create project in database
        const project = await sql`
          INSERT INTO projects (
            user_id,
            name,
            status,
            created_at,
            stripe_session_id,
            gender,
            uploaded_files_count
          )
          VALUES (
            ${userId},
            ${projectName || "Wizard Project"},
            'payment_completed',
            NOW(),
            ${session.id},
            ${gender || "unknown"},
            ${Number.parseInt(uploadedFiles || "0")}
          )
          RETURNING id
        `

        const projectId = project[0].id

        // Update wizard session
        await sql`
          UPDATE wizard_sessions 
          SET status = 'completed',
              project_id = ${projectId},
              completed_at = NOW()
          WHERE id = ${wizardSessionId}
        `

        // Log successful webhook processing
        await sql`
          INSERT INTO webhook_logs (
            event_type,
            stripe_session_id,
            project_id,
            status,
            created_at
          )
          VALUES (
            'wizard_checkout_completed',
            ${session.id},
            ${projectId},
            'success',
            NOW()
          )
        `

        console.log(`Wizard project created successfully: ${projectId}`)
      } catch (error) {
        console.error("Error processing wizard webhook:", error)

        // Log failed webhook processing
        await sql`
          INSERT INTO webhook_logs (
            event_type,
            stripe_session_id,
            status,
            error_message,
            created_at
          )
          VALUES (
            'wizard_checkout_completed',
            ${session.id},
            'error',
            ${error instanceof Error ? error.message : "Unknown error"},
            NOW()
          )
        `

        return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
