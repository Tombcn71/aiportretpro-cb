import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { trackInitiateCheckout } from "@/lib/facebook-pixel"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await req.json()
    const { planId, priceId, wizardFlow, successUrl, cancelUrl } = body

    // Use the correct price ID from your existing system
    const finalPriceId = priceId || "price_1RrFTnDswbEJWagVnjXYvNwh"

    console.log("🛒 Creating checkout session with price ID:", finalPriceId)
    console.log("👤 User email:", session.user.email)
    console.log("🧙‍♂️ Wizard flow:", wizardFlow)

    // Track Facebook Pixel event
    if (typeof window !== "undefined") {
      trackInitiateCheckout({
        content_ids: [finalPriceId],
        content_type: "product",
        currency: "EUR",
        value: 19.99,
      })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
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
      metadata: wizardFlow
        ? {
            flow: "wizard",
            planId: planId || "professional",
          }
        : {
            planId: planId || "professional",
          },
      allow_promotion_codes: true,
      billing_address_collection: "auto", // Niet verplicht
      customer_creation: "always",
      customer_email: session.user.email, // DIT VULT DE EMAIL AUTOMATISCH IN
    })

    console.log("✅ Checkout session created:", checkoutSession.id)

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error("❌ Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
