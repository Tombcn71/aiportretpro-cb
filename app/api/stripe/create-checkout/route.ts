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

    const { sessionId, couponCode, projectName, gender, uploadedPhotos } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    console.log("🛒 Creating Stripe checkout:", {
      sessionId,
      couponCode: couponCode || "none",
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      userEmail: session.user.email,
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1QSqJhP5wjEFaQw8tOHWJhzF",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}&wizard_session=${sessionId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      customer_email: session.user.email,
      allow_promotion_codes: true,
      metadata: {
        wizardSessionId: sessionId,
        userEmail: session.user.email,
        projectName,
        gender,
        photoCount: uploadedPhotos?.length?.toString() || "0",
      },
      ...(couponCode && { discounts: [{ coupon: couponCode }] }),
    })

    console.log("✅ Stripe checkout created:", checkoutSession.id)
    console.log("🔗 Redirect URL:", checkoutSession.url)

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 })
  }
}
