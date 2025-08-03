import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

// Store wizard data temporarily
const wizardDataStore = new Map()

export function saveWizardData(sessionId: string, data: any) {
  wizardDataStore.set(sessionId, data)
  console.log("💾 Wizard data saved for session:", sessionId)
}

export function getWizardData(sessionId: string) {
  return wizardDataStore.get(sessionId)
}

export async function POST(req: NextRequest) {
  console.log("🔔 WIZARD WEBHOOK RECEIVED")

  try {
    const body = await req.text()
    const headersList = req.headers
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("❌ No signature")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("✅ Event type:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.CheckoutSession

      console.log("💳 Processing checkout session:", session.id)
      console.log("📋 Metadata:", session.metadata)

      if (session.metadata?.type === "wizard") {
        const wizardSessionId = session.metadata.session_id
        const projectName = session.metadata.projectName
        const gender = session.metadata.gender
        const userEmail = session.metadata.userEmail

        if (!wizardSessionId) {
          console.error("❌ No wizard session ID in metadata")
          return NextResponse.json({ error: "No wizard session ID" }, { status: 400 })
        }

        console.log("🎉 Payment completed for wizard session:", wizardSessionId)

        try {
          // Get wizard data
          const wizardData = getWizardData(wizardSessionId)
          if (!wizardData) {
            console.error("❌ No wizard data found for session:", wizardSessionId)
            return NextResponse.json({ error: "Wizard data not found" }, { status: 400 })
          }

          // Get user from database
          const users = await sql`SELECT id FROM users WHERE email = ${userEmail}`
          if (users.length === 0) {
            console.error("❌ User not found:", userEmail)
            return NextResponse.json({ error: "User not found" }, { status: 400 })
          }

          const userId = users[0].id

          // Create project with pack 928
          const result = await sql`
            INSERT INTO projects (user_id, name, gender, outfits, backgrounds, uploaded_photos, status)
            VALUES (${userId}, ${projectName}, ${gender}, ${[]}, ${[]}, ${wizardData.uploadedPhotos}, 'training')
            RETURNING id
          `
          const projectId = result[0].id

          console.log("📁 Project created:", projectId)

          // Start Astria training
          const baseUrl = process.env.NEXTAUTH_URL
          const tuneBody = {
            tune: {
              title: `${projectName}_${projectId}`,
              name: gender,
              image_urls: wizardData.uploadedPhotos,
              callback: `${baseUrl}/api/astria/wizard-webhook/${projectId}`,
              prompt_attributes: {
                callback: `${baseUrl}/api/astria/wizard-prompt-webhook/${projectId}`,
              },
            },
          }

          const astriaResponse = await fetch("https://api.astria.ai/p/928/tunes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
            },
            body: JSON.stringify(tuneBody),
          })

          if (!astriaResponse.ok) {
            console.error("❌ Astria API error:", astriaResponse.status)
            throw new Error("Astria API error")
          }

          const astriaData = await astriaResponse.json()
          console.log("🎯 Astria training started:", astriaData.id)

          // Update project with tune ID
          await sql`
            UPDATE projects 
            SET tune_id = ${astriaData.id.toString()}
            WHERE id = ${projectId}
          `

          // Add credits to user (they paid for it)
          await sql`
            INSERT INTO credits (user_id, credits, created_at, updated_at)
            VALUES (${userId}, 1, NOW(), NOW())
            ON CONFLICT (user_id) 
            DO UPDATE SET 
              credits = credits.credits + 1,
              updated_at = NOW()
          `

          // Clean up wizard data
          wizardDataStore.delete(wizardSessionId)

          console.log("✅ Wizard flow completed successfully")
        } catch (error) {
          console.error("❌ Error processing wizard payment:", error)
          return NextResponse.json({ error: "Processing error" }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Wizard webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
