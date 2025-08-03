import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectName, gender, uploadedPhotos } = await request.json()

    if (!projectName || !gender || !uploadedPhotos || uploadedPhotos.length < 6) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Create wizard session
    const wizardSessionResult = await sql`
      INSERT INTO wizard_sessions (user_email, project_name, gender, uploaded_photos, status)
      VALUES (${session.user.email}, ${projectName}, ${gender}, ${JSON.stringify(uploadedPhotos)}, 'pending')
      RETURNING id
    `

    const wizardSessionId = wizardSessionResult[0].id

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Professional AI Headshots",
              description: "40 professionele AI-gegenereerde headshots",
            },
            unit_amount: 1999, // €19.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/wizard-training/${wizardSessionId}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/wizard/review`,
      metadata: {
        wizard_session_id: wizardSessionId,
        user_email: session.user.email,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
