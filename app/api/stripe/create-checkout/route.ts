import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos, userEmail, successUrl, cancelUrl } = await req.json()

    console.log("🛒 Creating Stripe checkout session for wizard:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      userEmail,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "AI Headshot Pakket",
              description: `50+ professionele AI headshots voor project: ${projectName}`,
              images: ["https://your-domain.com/images/product-image.jpg"],
            },
            unit_amount: 2900, // €29.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        type: "wizard_purchase",
        wizard_session_id: sessionId,
        project_name: projectName,
        gender: gender,
        photo_count: uploadedPhotos?.length?.toString() || "0",
        user_email: userEmail || "",
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      locale: "nl",
    })

    console.log("✅ Stripe checkout session created:", session.id)

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
