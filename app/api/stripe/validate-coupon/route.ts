import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { couponCode } = await request.json()

    if (!couponCode) {
      return NextResponse.json({
        valid: false,
        error: "Geen couponcode opgegeven",
      })
    }

    // Validate coupon with Stripe
    const coupon = await stripe.coupons.retrieve(couponCode.toUpperCase())

    if (!coupon || !coupon.valid) {
      return NextResponse.json({
        valid: false,
        code: couponCode,
        error: "Ongeldige of verlopen couponcode",
      })
    }

    // Check if coupon is still valid (not expired)
    if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({
        valid: false,
        code: couponCode,
        error: "Deze couponcode is verlopen",
      })
    }

    // Check usage limits
    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      return NextResponse.json({
        valid: false,
        code: couponCode,
        error: "Deze couponcode heeft het maximale aantal gebruiken bereikt",
      })
    }

    // Return valid coupon data
    return NextResponse.json({
      valid: true,
      code: coupon.id,
      discount: {
        type: coupon.percent_off ? "percentage" : "amount",
        value: coupon.percent_off || (coupon.amount_off ? coupon.amount_off / 100 : 0),
      },
    })
  } catch (error: any) {
    console.error("Error validating coupon:", error)

    if (error.code === "resource_missing") {
      return NextResponse.json({
        valid: false,
        error: "Couponcode niet gevonden",
      })
    }

    return NextResponse.json({
      valid: false,
      error: "Er is een fout opgetreden bij het valideren van de coupon",
    })
  }
}
