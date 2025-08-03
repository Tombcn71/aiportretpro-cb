import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const wizardSessionId = session.metadata?.wizard_session_id
      const userEmail = session.metadata?.user_email

      if (!wizardSessionId || !userEmail) {
        console.error("Missing metadata in webhook")
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }

      // Get wizard session data
      const wizardResult = await sql`
        SELECT * FROM wizard_sessions WHERE id = ${wizardSessionId}
      `

      if (wizardResult.length === 0) {
        console.error("Wizard session not found:", wizardSessionId)
        return NextResponse.json({ error: "Wizard session not found" }, { status: 404 })
      }

      const wizardSession = wizardResult[0]

      // Create project
      const projectResult = await sql`
        INSERT INTO projects (name, status, user_email, gender, uploaded_photos)
        VALUES (${wizardSession.project_name}, 'paid', ${userEmail}, ${wizardSession.gender}, ${wizardSession.uploaded_photos})
        RETURNING id
      `

      const projectId = projectResult[0].id

      // Update wizard session
      await sql`
        UPDATE wizard_sessions 
        SET status = 'paid', project_id = ${projectId}, updated_at = NOW()
        WHERE id = ${wizardSessionId}
      `

      // Start Astria training
      try {
        const uploadedPhotos = JSON.parse(wizardSession.uploaded_photos)

        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/projects/create-with-pack`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName: wizardSession.project_name,
            gender: wizardSession.gender,
            uploadedPhotos: uploadedPhotos,
            userEmail: userEmail,
            existingProjectId: projectId,
            packId: "928",
          }),
        })

        if (!response.ok) {
          console.error("Failed to start Astria training:", await response.text())
        } else {
          console.log("Astria training started successfully for project:", projectId)
        }
      } catch (error) {
        console.error("Error starting Astria training:", error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
