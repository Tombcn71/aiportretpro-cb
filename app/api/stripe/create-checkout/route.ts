import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail, metadata } = await req.json()

    console.log("🛒 Creating checkout session:", {
      priceId,
      customerEmail,
      metadata,
    })

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: metadata || {},
      allow_promotion_codes: true,
    })

    console.log("✅ Checkout session created:", session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("❌ Create checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
