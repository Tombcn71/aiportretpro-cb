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

    const { sessionId, projectName } = await request.json()

    if (!sessionId || !projectName) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `AI Headshots - ${projectName}`,
              description: "40+ professionele AI headshots",
            },
            unit_amount: 2999, // €29.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/wizard-training/${sessionId}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review?canceled=true`,
      metadata: {
        sessionId: sessionId.toString(),
        userEmail: session.user.email,
        projectName,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
