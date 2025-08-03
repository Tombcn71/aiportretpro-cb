import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
})

// Single plan configuration
export const PRICING_PLAN = {
  name: "Professional",
  price: 19.99,
  photos: 40,
  priceId: "price_1RrFsbDswbEJWagVsEytA8rs",
}
