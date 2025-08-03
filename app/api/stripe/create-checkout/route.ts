import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// In-memory storage for wizard data (in production, use Redis or database)
const wizardDataStore = new Map()

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
    const { wizardSessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    console.log("🛒 Creating Stripe checkout:", {
      wizardSessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      userEmail,
    })

    // Save wizard data
    saveWizardData(wizardSessionId, {
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
    })

    // Create Stripe checkout session using the specific price ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1RrFsbDswbEJWagVsEytA8rs", // Use the specific price ID
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
