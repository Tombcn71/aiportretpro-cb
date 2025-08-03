import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { wizardSessionId, projectName, gender, photoCount } = await request.json()

    // Validate required fields
    if (!wizardSessionId || !projectName || !gender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Safe photoCount conversion
    const safePhotoCount = photoCount || 0

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Professional AI Headshots",
              description: "40 professionele AI-gegenereerde headshots",
            },
            unit_amount: 1999, // €19.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}&wizard_session=${wizardSessionId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review`,
      metadata: {
        wizardSessionId,
        projectName,
        gender,
        photoCount: safePhotoCount.toString(),
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
