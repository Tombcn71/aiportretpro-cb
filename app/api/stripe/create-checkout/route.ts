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

    // First create project in database to get project ID
    const projectResult = await sql`
      INSERT INTO projects (
        user_email,
        guest_email,
        name,
        gender,
        uploaded_photos,
        status,
        user_session_id,
        photo_count,
        created_at,
        updated_at
      ) VALUES (
        ${session.user.email},
        ${session.user.email},
        ${projectName},
        ${gender},
        ${JSON.stringify(uploadedPhotos)},
        'photos_uploaded',
        ${wizardSessionId},
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
          price_data: {
            currency: "eur",
            product_data: {
              name: "AI Professional Headshots",
              description: "40 high-quality AI-generated professional headshots",
            },
            unit_amount: 1999, // €19.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: session.user.email,
      client_reference_id: projectId.toString(), // BELANGRIJK: Project ID hier
      metadata: {
        projectId: projectId.toString(), // EN hier
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
