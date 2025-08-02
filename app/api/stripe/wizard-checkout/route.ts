import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { wizardData, successUrl, cancelUrl } = await request.json()

    if (!wizardData) {
      return NextResponse.json({ error: "Missing wizard data" }, { status: 400 })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1QSqJhP5vTfZHjfvJhKJQqLs", // Your existing price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: session.user.email,
      metadata: {
        wizardData: JSON.stringify(wizardData),
        flow: "wizard",
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Wizard checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
