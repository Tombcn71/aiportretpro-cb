import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"

async function getStripe() {
  const { stripe } = await import("@/lib/stripe")
  return stripe
}

export async function POST(request: Request) {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail, metadata } = await request.json()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const stripe = await getStripe()

    // Create purchase record
    const purchaseResult = await sql`
      INSERT INTO purchases (user_id, plan_type, amount, headshots_included, status, created_at, updated_at)
      VALUES (${user.id}, 'professional', 1999, 40, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id
    `

    const purchaseId = purchaseResult[0].id

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        ...metadata,
        purchase_id: purchaseId.toString(),
        user_id: user.id.toString(),
      },
    })

    // Update purchase with Stripe session ID
    await sql`
      UPDATE purchases 
      SET stripe_session_id = ${checkoutSession.id}
      WHERE id = ${purchaseId}
    `

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
