import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// In-memory storage for wizard data (temporary)
const wizardDataStore = new Map<string, any>()

export function saveWizardData(sessionId: string, data: any) {
  wizardDataStore.set(sessionId, data)
}

export function getWizardData(sessionId: string) {
  return wizardDataStore.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardDataStore.delete(sessionId)
}

export async function POST(req: NextRequest) {
  try {
    const { wizardSessionId } = await req.json()

    if (!wizardSessionId) {
      return NextResponse.json({ error: "Missing wizard session ID" }, { status: 400 })
    }

    console.log("🛒 Creating Stripe checkout for wizard session:", wizardSessionId)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1RrFsbDswbEJWagVsEytA8rs", // Professional plan price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/wizard-training/${wizardSessionId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review?session=${wizardSessionId}`,
      allow_promotion_codes: true,
      metadata: {
        wizardSessionId: wizardSessionId,
        packId: "928",
        source: "wizard_flow",
      },
    })

    console.log("✅ Stripe session created:", session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
