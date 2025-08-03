import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

async function getStripe() {
  const { stripe } = await import("@/lib/stripe")
  return stripe
}

export async function POST(request: NextRequest) {
  console.log("🔔 WEBHOOK RECEIVED at", new Date().toISOString())

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    console.log("❌ No signature")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("❌ No webhook secret")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  try {
    const stripeInstance = await getStripe()
    const event = stripeInstance.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    console.log("✅ Event type:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      console.log("💳 Processing checkout session:", session.id)

      // Find and update the purchase
      const purchaseResult = await sql`
        UPDATE purchases 
        SET status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE stripe_session_id = ${session.id}
        RETURNING user_id, id
      `

      if (purchaseResult[0]) {
        const userId = purchaseResult[0].user_id
        console.log(`👤 Adding credit for user ${userId}`)

        // Add 1 credit - using INSERT with proper conflict handling
        try {
          const creditResult = await sql`
            INSERT INTO credits (user_id, credits, created_at, updated_at)
            VALUES (${userId}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
              credits = credits.credits + 1,
              updated_at = CURRENT_TIMESTAMP
            RETURNING credits
          `

          console.log(`✅ User ${userId} now has ${creditResult[0]?.credits} credits`)

          return NextResponse.json({
            received: true,
            userId,
            creditsAdded: 1,
            totalCredits: creditResult[0]?.credits,
          })
        } catch (creditError) {
          console.error("❌ Credit error:", creditError)

          // Fallback: try to update existing or create new
          const existingCredit = await sql`
            SELECT credits FROM credits WHERE user_id = ${userId}
          `

          if (existingCredit[0]) {
            // Update existing
            const updateResult = await sql`
              UPDATE credits 
              SET credits = credits + 1, updated_at = CURRENT_TIMESTAMP
              WHERE user_id = ${userId}
              RETURNING credits
            `
            console.log(`✅ Updated credits for user ${userId}: ${updateResult[0]?.credits}`)

            return NextResponse.json({
              received: true,
              userId,
              creditsAdded: 1,
              totalCredits: updateResult[0]?.credits,
            })
          } else {
            // Create new
            const newCredit = await sql`
              INSERT INTO credits (user_id, credits, created_at, updated_at)
              VALUES (${userId}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              RETURNING credits
            `
            console.log(`✅ Created new credits for user ${userId}: ${newCredit[0]?.credits}`)

            return NextResponse.json({
              received: true,
              userId,
              creditsAdded: 1,
              totalCredits: newCredit[0]?.credits,
            })
          }
        }
      } else {
        console.log("❌ No purchase found for session:", session.id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      {
        error: "Webhook error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}
