import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { wizardSessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    if (!wizardSessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    console.log("🛒 Creating Stripe checkout for wizard session:", wizardSessionId)

    // Save wizard data to database first (using existing projects table structure)
    try {
      // Get or create user
      const userResult = await sql`
        SELECT * FROM users WHERE email = ${userEmail}
      `

      let user = userResult[0]
      if (!user) {
        const createUserResult = await sql`
          INSERT INTO users (email, name, image, created_at, updated_at)
          VALUES (${userEmail}, '', '', NOW(), NOW())
          RETURNING *
        `
        user = createUserResult[0]
      }

      // Create temporary project record to store wizard data
      const projectResult = await sql`
        INSERT INTO projects (
          user_id,
          name,
          gender,
          uploaded_photos,
          status,
          created_at,
          updated_at
        )
        VALUES (
          ${user.id},
          ${projectName},
          ${gender},
          ${uploadedPhotos},
          'pending_payment',
          NOW(),
          NOW()
        )
        RETURNING *
      `

      const project = projectResult[0]
      console.log("📦 Temporary project created:", project.id)

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "ideal"],
        line_items: [
          {
            price: "price_1RrFsbDswbEJWagVsEytA8rs", // Professional plan price ID
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review`,
        allow_promotion_codes: true,
        metadata: {
          wizardSessionId,
          projectId: project.id.toString(),
          projectName,
          gender,
          userEmail,
          packId: "928",
          source: "wizard_flow",
          photoCount: uploadedPhotos.length.toString(),
        },
      })

      console.log("✅ Stripe checkout session created:", checkoutSession.id)

      return NextResponse.json({
        url: checkoutSession.url,
        sessionId: checkoutSession.id,
      })
    } catch (dbError) {
      console.error("❌ Database error:", dbError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
