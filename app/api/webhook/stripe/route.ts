import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      console.log("❌ No Stripe signature found")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.log("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("✅ Webhook received:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      console.log("💳 Payment completed for session:", session.id)
      console.log("👤 Customer email:", session.customer_details?.email)

      if (session.customer_details?.email) {
        const userEmail = session.customer_details.email

        try {
          // First ensure the user exists in credits table
          await sql`
            INSERT INTO credits (user_id, credits)
            VALUES (${userEmail}, 0)
            ON CONFLICT (user_id) DO NOTHING
          `

          // Then add 1 credit
          const result = await sql`
            UPDATE credits 
            SET credits = credits + 1, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ${userEmail}
            RETURNING credits
          `

          if (result.length > 0) {
            console.log("✅ Added 1 credit to user:", userEmail)
            console.log("💰 New credit balance:", result[0].credits)
          } else {
            console.log("❌ Failed to update credits for user:", userEmail)
          }
        } catch (dbError) {
          console.error("❌ Database error:", dbError)

          // Fallback: try simple insert if update fails
          try {
            await sql`
              INSERT INTO credits (user_id, credits)
              VALUES (${userEmail}, 1)
            `
            console.log("✅ Fallback: Created new credit entry for user:", userEmail)
          } catch (fallbackError) {
            console.error("❌ Fallback also failed:", fallbackError)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: "Stripe webhook endpoint is working" })
}
