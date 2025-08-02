// app/api/stripe/wizard-webhook/route.ts

import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
})

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")!
  const body = await request.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      // Then define and call a function to handle the checkout.session.completed event
      if (session.mode === "subscription") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        // Handle subscription
        console.log(`Subscription ${subscription.id} for customer ${subscription.customer} completed.`)
      }
      break
    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice
      // Then define and call a function to handle the invoice.payment_succeeded event
      console.log(`Invoice ${invoice.id} for customer ${invoice.customer} paid.`)
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
