import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { sql } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

async function getStripe() {
  const { stripe } = await import("@/lib/stripe")
  return stripe
}

export async function POST(req: NextRequest) {
  console.log("🔔 WIZARD WEBHOOK RECEIVED at", new Date().toISOString())

  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.log("❌ No signature")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("❌ No webhook secret")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    let event: Stripe.Event

    try {
      const stripeInstance = await getStripe()
      event = stripeInstance.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("✅ Event type:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.CheckoutSession

      console.log("💳 Processing wizard checkout session:", session.id)
      console.log("📋 Session metadata:", session.metadata)

      // Check if this is a wizard flow
      if (session.metadata?.flow === "wizard") {
        console.log("🧙‍♂️ This is a wizard flow!")

        // Get user by email
        const userResult = await sql`
          SELECT * FROM users WHERE email = ${session.customer_email}
        `

        if (!userResult[0]) {
          console.error("❌ User not found for email:", session.customer_email)
          return NextResponse.json({ error: "User not found" }, { status: 400 })
        }

        const user = userResult[0]
        console.log("👤 Found user:", user.id)

        // Create purchase record
        const purchaseResult = await sql`
          INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status)
          VALUES (${user.id}, ${session.id}, 'professional', 1999, 40, 'completed')
          RETURNING *
        `

        const purchase = purchaseResult[0]
        console.log("💰 Purchase created:", purchase.id)

        // Add credit
        await sql`
          INSERT INTO credits (user_id, credits, created_at, updated_at)
          VALUES (${user.id}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            credits = credits.credits + 1,
            updated_at = CURRENT_TIMESTAMP
        `

        console.log("✅ Credit added for user:", user.id)

        // Get wizard data from localStorage (we'll need to handle this differently)
        // For now, create project with default data and let user complete it
        const projectResult = await sql`
          INSERT INTO projects (user_id, purchase_id, name, gender, status)
          VALUES (${user.id}, ${purchase.id}, 'Wizard Project', 'man', 'pending_wizard_data')
          RETURNING *
        `

        const project = projectResult[0]
        console.log("🎯 Wizard project created:", project.id)

        return NextResponse.json({
          received: true,
          userId: user.id,
          projectId: project.id,
          flow: "wizard",
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Wizard webhook error:", error)
    return NextResponse.json(
      {
        error: "Webhook error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}
