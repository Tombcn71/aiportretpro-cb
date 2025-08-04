import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { wizardSessionId, projectName, gender, photos } = await request.json()

    if (!wizardSessionId || !projectName || !gender || !photos || photos.length < 6) {
      return NextResponse.json({ error: "Missing required wizard data" }, { status: 400 })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "AI Portrait Pro - 40 Professionele Headshots",
              description: `Project: ${projectName} (${gender === "man" ? "Mannelijk" : "Vrouwelijk"})`,
              images: ["https://your-domain.com/images/product-image.jpg"],
            },
            unit_amount: 2900, // €29.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}&wizard_session=${wizardSessionId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      customer_email: session.user.email,
      metadata: {
        wizardSessionId,
        projectName,
        gender,
        photoCount: photos.length.toString(),
        userEmail: session.user.email,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe wizard checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
