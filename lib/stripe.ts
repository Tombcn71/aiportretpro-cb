import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export const STRIPE_PRICES = {
  pro: "price_1QQvJhP5y0lUWKkKJvJvJvJv", // $29 Pro plan
}
