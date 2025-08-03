import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { priceId, userEmail, metadata } = await req.json()

    console.log("💳 Creating checkout session:", {
      priceId,
      userEmail,
      metadata,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      customer_email: userEmail,
      metadata: metadata || {},
    })

    console.log("✅ Checkout session created:", session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}
