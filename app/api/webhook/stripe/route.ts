import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"
import { createTuneWithPack } from "@/lib/astria"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  console.log("🎯 Stripe webhook event:", event.type)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    console.log("💳 Payment completed:", {
      sessionId: session.id,
      customerEmail: session.customer_email,
      metadata: session.metadata,
    })

    try {
      const { wizardSessionId, projectName, gender, userEmail } = session.metadata!

      // Get wizard data from database
      const wizardResult = await sql`
        SELECT uploaded_photos FROM wizard_sessions 
        WHERE id = ${wizardSessionId} AND expires_at > CURRENT_TIMESTAMP
      `

      if (wizardResult.length === 0) {
        console.error("❌ No wizard data found for session:", wizardSessionId)
        return NextResponse.json({ error: "Wizard data not found" }, { status: 400 })
      }

      const uploadedPhotos = wizardResult[0].uploaded_photos

      console.log("🎨 Creating project after payment:", {
        projectName,
        gender,
        userEmail,
        photoCount: uploadedPhotos?.length,
      })

      // Find or create user
      let user = await sql`
        SELECT id FROM users WHERE email = ${userEmail}
      `

      if (user.length === 0) {
        const newUser = await sql`
          INSERT INTO users (email, name, created_at)
          VALUES (${userEmail}, ${userEmail.split("@")[0]}, CURRENT_TIMESTAMP)
          RETURNING id
        `
        user = newUser
      }

      const userId = user[0].id

      // Create project
      const project = await sql`
        INSERT INTO projects (user_id, name, gender, uploaded_photos, status, created_at)
        VALUES (${userId}, ${projectName}, ${gender}, ${JSON.stringify(uploadedPhotos)}, 'training', CURRENT_TIMESTAMP)
        RETURNING id
      `

      const projectId = project[0].id

      console.log("✅ Project created:", projectId)

      // Start Astria training with pack 928
      const packId = "928"
      const tuneResult = await createTuneWithPack(packId, {
        title: `${projectName}_${projectId}`,
        name: gender,
        imageUrls: uploadedPhotos,
        projectId: projectId,
        userId: userId,
      })

      // Update project with tune ID
      await sql`
        UPDATE projects 
        SET tune_id = ${tuneResult.id.toString()}, status = 'training'
        WHERE id = ${projectId}
      `

      console.log("🚀 Astria training started:", tuneResult.id)

      // Clean up wizard data
      await sql`
        DELETE FROM wizard_sessions WHERE id = ${wizardSessionId}
      `

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("❌ Error processing payment:", error)
      return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
