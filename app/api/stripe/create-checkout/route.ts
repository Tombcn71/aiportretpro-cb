import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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
    const { planId, priceId, wizardSessionId } = body

    const finalPriceId = priceId || "price_1RrFTnDswbEJWagVnjXYvNwh"

    console.log("🛒 Creating checkout with wizard session ID:", wizardSessionId)

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      metadata: {
        flow: "wizard",
        planId: planId || "professional",
        wizardSessionId: wizardSessionId, // Store session ID in metadata
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: "always",
      customer_email: session.user.email,
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
