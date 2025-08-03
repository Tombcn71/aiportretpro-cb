import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { wizardSessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    if (!wizardSessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    console.log("🛒 Creating Stripe checkout for wizard session:", wizardSessionId)
    console.log("📧 User email:", userEmail)
    console.log("📸 Photos count:", uploadedPhotos.length)

    // Get or create user first
    const userResult = await sql`
      SELECT * FROM users WHERE email = ${userEmail}
    `

    let user = userResult[0]
    if (!user) {
      console.log("👤 Creating new user:", userEmail)
      const createUserResult = await sql`
        INSERT INTO users (email, name, image, created_at, updated_at)
        VALUES (${userEmail}, ${userEmail.split("@")[0]}, '', NOW(), NOW())
        RETURNING *
      `
      user = createUserResult[0]
    }

    // Create project record to store wizard data
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
        ${JSON.stringify(uploadedPhotos)},
        'pending_payment',
        NOW(),
        NOW()
      )
      RETURNING *
    `

    const project = projectResult[0]
    console.log("📦 Project created with ID:", project.id)

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      customer_email: userEmail,
      line_items: [
        {
          price: "price_1RrFsbDswbEJWagVsEytA8rs",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review`,
      allow_promotion_codes: true,
      metadata: {
        projectId: project.id.toString(),
        projectName: projectName,
        gender: gender,
        userEmail: userEmail,
        packId: "928",
        source: "wizard_flow",
        photoCount: uploadedPhotos.length.toString(),
        wizardSessionId: wizardSessionId,
      },
    })

    console.log("✅ Stripe checkout session created:", checkoutSession.id)
    console.log("📧 Customer email set to:", checkoutSession.customer_email)
    console.log("🏷️ Metadata:", checkoutSession.metadata)

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
