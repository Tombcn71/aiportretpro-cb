import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  try {
    const { sessionId, userEmail, couponCode } = await request.json()

    if (!sessionId || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sessionData: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1QSjJhP5wjjQQQQQQQQQQQQQ", // Your actual price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      customer_email: userEmail,
      metadata: {
        wizard_session_id: sessionId,
        user_email: userEmail,
      },
    }

    // Add coupon if provided
    if (couponCode) {
      sessionData.discounts = [{ coupon: couponCode }]
      sessionData.metadata!.discount_code = couponCode
    }

    const session = await stripe.checkout.sessions.create(sessionData)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
