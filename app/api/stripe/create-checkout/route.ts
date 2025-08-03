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

    // Build checkout session configuration
    const checkoutConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1QSqJhP5wjEFaQw8tOHWJhzF", // €19.99 price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}&wizard_session=${sessionId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      customer_email: session.user.email,
      allow_promotion_codes: true,
      metadata: {
        wizard_session_id: sessionId,
        project_name: projectName,
        gender: gender,
        user_email: session.user.email,
        photo_count: uploadedPhotos?.length?.toString() || "0",
      },
    }

    // Add coupon if provided
    if (couponCode && couponCode.trim()) {
      try {
        // Validate coupon exists in Stripe
        const coupon = await stripe.coupons.retrieve(couponCode.trim())
        if (coupon && coupon.valid) {
          checkoutConfig.discounts = [{ coupon: couponCode.trim() }]
          console.log("✅ Coupon applied:", couponCode.trim())
        }
      } catch (couponError) {
        console.log("⚠️ Invalid coupon code, continuing without discount:", couponCode.trim())
        // Continue without coupon if invalid - don't fail the checkout
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutConfig)

    console.log("✅ Stripe checkout session created:", checkoutSession.id)
    console.log("🔗 Checkout URL:", checkoutSession.url)

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: `Stripe error: ${error.message}`,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to create checkout session",
      },
      { status: 500 },
    )
  }
}
