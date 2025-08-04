import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { wizardSessionId, projectName, gender, photos } = await request.json()

    if (!wizardSessionId || !projectName || !gender || !photos || photos.length < 4) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "AI Portrait Pro - Professional Headshots",
              description: `40 professionele AI headshots voor project: ${projectName}`,
              images: ["https://aiportretpro.nl/images/logo-icon.png"],
            },
            unit_amount: 2900, // €29.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}&wizard_session=${wizardSessionId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      customer_email: session.user.email,
      metadata: {
        type: "wizard_purchase",
        wizardSessionId,
        projectName,
        gender,
        photoCount: photos.length.toString(),
        userEmail: session.user.email,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Wizard checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
