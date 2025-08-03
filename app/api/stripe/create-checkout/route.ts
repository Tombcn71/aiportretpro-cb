import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { wizardSessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    if (!wizardSessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    console.log("🛒 Creating Stripe checkout for wizard session:", wizardSessionId)

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1RrFsbDswbEJWagVsEytA8rs", // Professional plan price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review`,
      allow_promotion_codes: true,
      metadata: {
        wizardSessionId,
        projectName,
        gender,
        uploadedPhotos: JSON.stringify(uploadedPhotos),
        userEmail,
        packId: "928",
        source: "wizard_flow",
        photoCount: uploadedPhotos.length.toString(),
      },
    })

    console.log("✅ Stripe checkout session created:", checkoutSession.id)

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
