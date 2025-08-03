import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// Simple in-memory storage
const wizardSessions = new Map<string, any>()

export function saveWizardData(sessionId: string, data: any) {
  wizardSessions.set(sessionId, data)
  console.log("💾 Saved wizard data:", sessionId)
}

export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
}

export async function POST(req: NextRequest) {
  try {
    const { wizardSessionId } = await req.json()

    if (!wizardSessionId) {
      return NextResponse.json({ error: "Missing wizard session ID" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1RrFsbDswbEJWagVsEytA8rs",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/wizard-training/${wizardSessionId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review?session=${wizardSessionId}`,
      allow_promotion_codes: true,
      metadata: {
        wizardSessionId,
        packId: "928",
        source: "wizard_flow",
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
