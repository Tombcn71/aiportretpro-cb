import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    // Create a 10% off coupon
    const coupon = await stripe.coupons.create({
      name: "WELCOME10",
      percent_off: 10,
      duration: "once",
      max_redemptions: null, // Unlimited
    })

    console.log("✅ Coupon created:", coupon.id)

    return NextResponse.json({ 
      success: true, 
      couponId: coupon.id,
      couponName: coupon.name 
    })
  } catch (error) {
    console.error("❌ Error creating coupon:", error)
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    )
  }
} 