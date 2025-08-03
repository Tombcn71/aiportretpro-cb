import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import Stripe from "stripe"

const sql = neon(process.env.DATABASE_URL!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const { projectId, projectName, gender, wizardSessionId, packId, uploadedPhotos } = session.metadata!

    console.log("💳 Payment completed for project:", projectId)

    try {
      // Parse uploaded photos
      let photoUrls: string[] = []
      try {
        photoUrls = JSON.parse(uploadedPhotos!)
      } catch (e) {
        console.error("Failed to parse uploaded photos:", e)
        return NextResponse.json({ error: "Invalid photo data" }, { status: 400 })
      }

      // Update project status to paid
      await sql`
        UPDATE projects 
        SET status = 'paid', updated_at = NOW()
        WHERE id = ${Number.parseInt(projectId!)}
      `

      // Start Astria training
      const trainingResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/projects/create-with-pack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          gender,
          uploadedPhotos: photoUrls,
          userEmail: session.customer_details?.email,
          packId,
          existingProjectId: Number.parseInt(projectId!),
        }),
      })

      if (!trainingResponse.ok) {
        console.error("❌ Failed to start training:", await trainingResponse.text())
        // Update project status to error
        await sql`
          UPDATE projects 
          SET status = 'error', updated_at = NOW()
          WHERE id = ${Number.parseInt(projectId!)}
        `
        return NextResponse.json({ error: "Failed to start training" }, { status: 500 })
      }

      console.log("✅ Training started successfully for project:", projectId)
    } catch (error) {
      console.error("❌ Error processing payment:", error)
      return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
