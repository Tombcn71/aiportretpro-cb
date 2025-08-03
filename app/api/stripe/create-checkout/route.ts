import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { saveWizardData } from "../../wizard/save-data/route"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { wizardSessionId, projectName, gender, uploadedPhotos, userEmail, couponCode, price } = await req.json()

    console.log("🛒 Creating Stripe checkout:", {
      wizardSessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      userEmail,
      couponCode,
      price,
    })

    // Save wizard data
    saveWizardData(wizardSessionId, {
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "AI Headshots - 40 Professional Photos",
              description: `Project: ${projectName} | Gender: ${gender} | Photos: ${uploadedPhotos?.length || 0}`,
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userEmail,
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      metadata: {
        wizardSessionId,
        projectName,
        gender,
        userEmail,
        couponCode: couponCode || "",
        photoCount: uploadedPhotos?.length?.toString() || "0",
      },
    })

    console.log("✅ Stripe checkout session created:", session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
