import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { trackInitiateCheckout } from "@/lib/facebook-pixel"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planId, priceId, wizardData, successUrl, cancelUrl } = body

    // Use the correct price ID from your existing system
    const finalPriceId = priceId || "price_1RrFTnDswbEJWagVnjXYvNwh"

    console.log("🛒 Creating checkout session with price ID:", finalPriceId)
    console.log("🛒 Wizard data:", wizardData)

    // Track Facebook Pixel event
    if (typeof window !== "undefined") {
      trackInitiateCheckout({
        content_ids: [finalPriceId],
        content_type: "product",
        currency: "EUR",
        value: 19.99,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/dashboard`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: wizardData
        ? {
            flow: "wizard",
            wizardData: JSON.stringify(wizardData),
          }
        : {},
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_creation: "always",
    })

    console.log("✅ Checkout session created:", session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("❌ Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
