import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getWizardData } from "../../wizard/save-data/route"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { wizardSessionId, userEmail } = await req.json()

    console.log("🛒 Creating checkout for wizard session:", wizardSessionId)
    console.log("📧 User email:", userEmail)

    // Get wizard data
    const wizardData = getWizardData(wizardSessionId)
    if (!wizardData) {
      return NextResponse.json({ error: "Wizard session not found" }, { status: 400 })
    }

    console.log("✅ Found wizard data:", {
      projectName: wizardData.projectName,
      gender: wizardData.gender,
      photoCount: wizardData.uploadedPhotos.length,
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Professional AI Headshots",
              description: "40 high-quality AI-generated professional headshots",
            },
            unit_amount: 1999, // €19.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/wizard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout?session=${wizardSessionId}`,
      customer_email: userEmail,
      metadata: {
        wizardSessionId: wizardSessionId,
      },
      allow_promotion_codes: true,
    })

    console.log("✅ Stripe session created:", session.id)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("❌ Checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}
