// app/api/webhook/stripe/route.ts

import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"]!

    let event

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Then define and call a function to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break
      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
        // Then define and call a function to handle the failed payment intent.
        // handlePaymentIntentPaymentFailed(failedPaymentIntent);
        break
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } else {
    res.setHeader("Allow", "POST")
    res.status(405).end("Method Not Allowed")
  }
}
