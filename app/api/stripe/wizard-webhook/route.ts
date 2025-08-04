import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { sql } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const { wizardSessionId, projectName, gender, photoCount, userEmail } = session.metadata || {}

      if (!wizardSessionId || !projectName || !gender || !userEmail) {
        console.error("Missing metadata in webhook:", session.metadata)
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }

      console.log("🎉 Wizard payment completed:", {
        wizardSessionId,
        projectName,
        gender,
        photoCount,
        userEmail,
      })

      try {
        // Get user ID
        const userResult = await sql`
          SELECT id FROM users WHERE email = ${userEmail}
        `

        if (userResult.length === 0) {
          throw new Error("User not found")
        }

        const userId = userResult[0].id

        // Get wizard session data
        const wizardResult = await sql`
          SELECT * FROM wizard_sessions 
          WHERE id = ${wizardSessionId} AND user_id = ${userId}
        `

        if (wizardResult.length === 0) {
          throw new Error("Wizard session not found")
        }

        const wizardData = wizardResult[0]
        const photos = wizardData.photos ? JSON.parse(wizardData.photos) : []

        // Create project
        const projectResult = await sql`
          INSERT INTO projects (
            user_id, 
            name, 
            gender, 
            status, 
            stripe_session_id,
            created_at, 
            updated_at
          )
          VALUES (
            ${userId}, 
            ${projectName}, 
            ${gender}, 
            'processing',
            ${session.id},
            CURRENT_TIMESTAMP, 
            CURRENT_TIMESTAMP
          )
          RETURNING id
        `

        const projectId = projectResult[0].id

        // Save photos to project
        for (const photoUrl of photos) {
          await sql`
            INSERT INTO photos (project_id, url, created_at)
            VALUES (${projectId}, ${photoUrl}, CURRENT_TIMESTAMP)
          `
        }

        // Start AI training (placeholder - implement actual AI training)
        console.log("🚀 Starting AI training for project:", projectId)

        // Update project status to training
        await sql`
          UPDATE projects 
          SET status = 'training', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${projectId}
        `

        // Clean up wizard session
        await sql`
          DELETE FROM wizard_sessions WHERE id = ${wizardSessionId}
        `

        console.log("✅ Wizard project created successfully:", projectId)
      } catch (error) {
        console.error("Error processing wizard payment:", error)
        return NextResponse.json({ error: "Processing failed" }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Wizard webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
