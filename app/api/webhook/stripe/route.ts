import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const { sessionId, userEmail, projectName } = session.metadata!

    try {
      // Update wizard session as paid
      await sql`
        UPDATE wizard_sessions 
        SET status = 'paid', stripe_session_id = ${session.id}, updated_at = NOW()
        WHERE id = ${sessionId} AND user_email = ${userEmail}
      `

      // Create user if not exists
      await sql`
        INSERT INTO users (email, created_at) 
        VALUES (${userEmail}, NOW()) 
        ON CONFLICT (email) DO NOTHING
      `

      // Create purchase record
      await sql`
        INSERT INTO purchases (user_email, stripe_session_id, amount, status, wizard_session_id, created_at)
        VALUES (${userEmail}, ${session.id}, ${session.amount_total}, 'completed', ${sessionId}, NOW())
      `

      // Start Astria training process here
      // This would trigger the actual AI training
      console.log(`Payment completed for session ${sessionId}, starting training...`)
    } catch (error) {
      console.error("Error processing webhook:", error)
      return NextResponse.json({ error: "Processing failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
