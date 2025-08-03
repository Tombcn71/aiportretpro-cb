import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, couponCode } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1QSqJhP5wjEFaQw8tOHWJhzF", // €19.99 price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      customer_email: session.user.email,
      metadata: {
        wizardSessionId: sessionId,
        userEmail: session.user.email,
      },
      ...(couponCode && { discounts: [{ coupon: couponCode }] }),
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 })
  }
}
