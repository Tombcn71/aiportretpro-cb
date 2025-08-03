import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import Stripe from "stripe"

const sql = neon(process.env.DATABASE_URL!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  try {
    const { projectName, gender, uploadedPhotos, wizardSessionId, packId = "928" } = await request.json()

    console.log("🛒 Creating checkout session:", {
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      wizardSessionId,
      packId,
    })

    if (!projectName || !gender || !uploadedPhotos || uploadedPhotos.length < 4) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Create project in database first
    const projectResult = await sql`
      INSERT INTO projects (name, status, uploaded_photos, wizard_session_id, created_at, updated_at)
      VALUES (${projectName}, 'pending', ${uploadedPhotos}, ${wizardSessionId}, NOW(), NOW())
      RETURNING id
    `

    const projectId = projectResult[0].id

    console.log("📦 Created project:", projectId)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Professional AI Headshots",
              description: "40 professionele AI headshots",
            },
            unit_amount: 1999, // €19.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/wizard-training/${wizardSessionId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review`,
      metadata: {
        projectId: projectId.toString(),
        projectName,
        gender,
        wizardSessionId,
        packId,
        uploadedPhotos: JSON.stringify(uploadedPhotos),
      },
    })

    console.log("✅ Stripe session created:", session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("❌ Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
