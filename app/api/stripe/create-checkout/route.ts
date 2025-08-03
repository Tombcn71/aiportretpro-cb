import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId, projectName, gender, photoCount, userEmail } = await request.json()

    console.log("🛒 Creating Stripe checkout:", {
      sessionId,
      projectName,
      gender,
      photoCount,
      userEmail,
    })

    // Ensure photoCount is a number and convert to string safely
    const safePhotoCount = photoCount || 0
    const photoCountString = safePhotoCount.toString()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1RrFsbDswbEJWagVsEytA8rs",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}&wizard_session=${sessionId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review`,
      customer_email: userEmail,
      allow_promotion_codes: true,
      metadata: {
        wizardSessionId: sessionId || "",
        projectName: projectName || "",
        gender: gender || "",
        photoCount: photoCountString,
        userEmail: userEmail || "",
      },
    })

    console.log("✅ Stripe checkout session created:", session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
