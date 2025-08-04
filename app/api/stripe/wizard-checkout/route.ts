import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { userId, couponCode } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get wizard session
    const sessions = await sql`
      SELECT * FROM wizard_sessions 
      WHERE user_id = ${userId} 
      AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT 1
    `

    if (sessions.length === 0) {
      return NextResponse.json({ error: "No active wizard session found" }, { status: 404 })
    }

    const session = sessions[0]

    // Create Stripe checkout session
    const checkoutSessionData: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Professional AI Headshots",
              description: "40 professionele portretfoto's gegenereerd door AI",
              images: ["https://your-domain.com/images/product-image.jpg"],
            },
            unit_amount: 1999, // €19.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/checkout`,
      metadata: {
        userId,
        wizardSessionId: session.id,
        projectName: session.project_name || "",
        gender: session.gender || "",
        uploadedFiles: session.uploaded_files?.toString() || "0",
      },
      customer_email: userId,
    }

    // Add coupon if provided and valid
    if (couponCode) {
      try {
        const coupon = await stripe.coupons.retrieve(couponCode.toUpperCase())
        if (coupon && coupon.valid) {
          checkoutSessionData.discounts = [
            {
              coupon: coupon.id,
            },
          ]
        }
      } catch (error) {
        console.error("Error applying coupon:", error)
        // Continue without coupon if invalid
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutSessionData)

    // Update wizard session with checkout session ID
    await sql`
      UPDATE wizard_sessions 
      SET stripe_session_id = ${checkoutSession.id},
          status = 'checkout_created'
      WHERE id = ${session.id}
    `

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("Error creating wizard checkout:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
