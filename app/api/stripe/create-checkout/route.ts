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

    const { sessionId, projectName, gender, uploadedPhotos } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    console.log("🛒 Creating Stripe checkout:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      userEmail: session.user.email,
    })

    // Save wizard data first
    try {
      const saveResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/wizard/save-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          projectName,
          gender,
          uploadedPhotos,
          userEmail: session.user.email,
        }),
      })
      console.log("✅ Wizard data save response:", saveResponse.status)
    } catch (saveError) {
      console.log("⚠️ Failed to save wizard data:", saveError)
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1RrFsbDswbEJWagVsEytA8rs", // Updated price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}&wizard_session=${sessionId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/upload`,
      customer_email: session.user.email,
      allow_promotion_codes: true, // This enables coupon codes in Stripe checkout
      metadata: {
        wizardSessionId: sessionId,
        userEmail: session.user.email,
        projectName,
        gender,
        photoCount: uploadedPhotos?.length?.toString() || "0",
      },
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
