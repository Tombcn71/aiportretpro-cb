import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { getWizardData, deleteWizardData } from "../../../wizard/save-data/route"
import { sql } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const wizardSessionId = session.metadata?.wizard_session_id
      const userEmail = session.metadata?.user_email

      console.log("💰 Payment completed for wizard session:", wizardSessionId)

      if (!wizardSessionId || !userEmail) {
        console.error("❌ Missing wizard session data in webhook")
        return NextResponse.json({ error: "Missing session data" }, { status: 400 })
      }

      // Get wizard data
      let wizardData = getWizardData(wizardSessionId)

      if (!wizardData) {
        // Try to get from database
        try {
          const result = await sql`
            SELECT * FROM wizard_sessions 
            WHERE session_id = ${wizardSessionId}
          `
          if (result.length > 0) {
            wizardData = result[0]
            wizardData.uploadedPhotos = JSON.parse(wizardData.uploaded_photos)
          }
        } catch (error) {
          console.error("❌ Failed to get wizard data from database:", error)
        }
      }

      if (!wizardData) {
        console.error("❌ No wizard data found for session:", wizardSessionId)
        return NextResponse.json({ error: "Wizard data not found" }, { status: 404 })
      }

      // Create project with Astria training
      try {
        const projectResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/projects/create-with-pack`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            uploadedPhotos: wizardData.uploadedPhotos,
            userEmail: userEmail,
            packId: 928, // Hardcoded pack ID
          }),
        })

        if (projectResponse.ok) {
          const projectData = await projectResponse.json()
          console.log("✅ Project created successfully:", projectData.projectId)

          // Clean up wizard data
          deleteWizardData(wizardSessionId)

          // Clean up database
          try {
            await sql`DELETE FROM wizard_sessions WHERE session_id = ${wizardSessionId}`
          } catch (error) {
            console.log("⚠️ Failed to clean up database:", error)
          }
        } else {
          console.error("❌ Failed to create project:", await projectResponse.text())
        }
      } catch (error) {
        console.error("❌ Error creating project:", error)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
