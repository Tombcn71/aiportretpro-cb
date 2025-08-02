import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { trackInitiateCheckout } from "@/lib/facebook-pixel"
import { PRICING_PLAN } from "@/lib/stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { priceId = PRICING_PLAN.priceId, wizardData, successUrl, cancelUrl } = body

    console.log("🛒 Creating checkout session with wizard data:", wizardData)

    // Track Facebook Pixel event
    if (typeof window !== "undefined") {
      trackInitiateCheckout({
        content_ids: [priceId],
        content_type: "product",
        currency: "EUR",
        value: PRICING_PLAN.price,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/wizard/welcome?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/wizard/checkout?canceled=true`,
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
