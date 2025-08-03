import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectName, gender, uploadedPhotos, wizardSessionId, packId = "928" } = await request.json()

    console.log("🛒 Creating Stripe checkout with data:", {
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      wizardSessionId,
      userEmail: session.user.email,
    })

    // Get or create user first
    const userResult = await sql`
      SELECT * FROM users WHERE email = ${session.user.email}
    `

    let user = userResult[0]
    if (!user) {
      console.log("👤 Creating new user:", session.user.email)
      const createUserResult = await sql`
        INSERT INTO users (email, name, image, created_at, updated_at)
        VALUES (${session.user.email}, ${session.user.email.split("@")[0]}, '', NOW(), NOW())
        RETURNING *
      `
      user = createUserResult[0]
    }

    // Create project in database to get project ID
    const projectResult = await sql`
      INSERT INTO projects (
        user_id,
        name,
        gender,
        uploaded_photos,
        status,
        user_session_id,
        guest_email,
        photo_count,
        created_at,
        updated_at
      ) VALUES (
        ${user.id},
        ${projectName},
        ${gender},
        ${uploadedPhotos},
        'photos_uploaded',
        ${wizardSessionId},
        ${session.user.email},
        ${uploadedPhotos?.length || 0},
        NOW(),
        NOW()
      )
      RETURNING id
    `

    const projectId = projectResult[0].id
    console.log("📦 Created project with ID:", projectId)

    // Create Stripe checkout session with project ID in metadata
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: "price_1RrFsbDswbEJWagVsEytA8rs",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: session.user.email,
      client_reference_id: projectId.toString(),
      metadata: {
        projectId: projectId.toString(),
        projectName: projectName,
        gender: gender,
        userEmail: session.user.email,
        wizardSessionId: wizardSessionId,
        packId: packId,
        photoCount: uploadedPhotos?.length?.toString() || "0",
        source: "wizard",
      },
      success_url: `${process.env.NEXTAUTH_URL}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review`,
      allow_promotion_codes: true,
    })

    console.log("✅ Stripe checkout created:", checkoutSession.id)
    console.log("🏷️ Metadata sent to Stripe:", checkoutSession.metadata)

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
      projectId: projectId,
    })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
