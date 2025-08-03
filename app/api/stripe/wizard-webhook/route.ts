import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { sql } from "@/lib/db"
import { getWizardData, deleteWizardData } from "@/app/api/wizard/save-data/route"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  console.log("🔔 WIZARD WEBHOOK RECEIVED")

  try {
    const body = await req.text()
    const headersList = await headers()
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

        if (!wizardSessionId) {
          console.error("❌ No wizard session ID in metadata")
          return NextResponse.json({ error: "No wizard session ID" }, { status: 400 })
        }

        console.log("🧙‍♂️ Getting wizard data for session:", wizardSessionId)

        // Get wizard data from memory
        const wizardData = getWizardData(wizardSessionId)

        if (!wizardData) {
          console.error("❌ Wizard session not found:", wizardSessionId)
          return NextResponse.json({ error: "Wizard session not found" }, { status: 400 })
        }

        console.log("✅ Found wizard data:", {
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          photoCount: wizardData.uploadedPhotos.length,
        })

        // Get customer email from session
        const customerEmail = session.customer_email || wizardData.userEmail

        if (!customerEmail) {
          console.error("❌ No customer email")
          return NextResponse.json({ error: "No customer email" }, { status: 400 })
        }

        // Get or create user in existing users table
        const userResult = await sql`
          SELECT * FROM users WHERE email = ${customerEmail}
        `

        let user = userResult[0]
        if (!user) {
          // Create user if doesn't exist
          const createUserResult = await sql`
            INSERT INTO users (email, name, image, created_at, updated_at)
            VALUES (${customerEmail}, '', '', NOW(), NOW())
            RETURNING *
          `
          user = createUserResult[0]
        }

        console.log("👤 User:", user.id, user.email)

        // Create purchase record in existing purchases table
        const purchaseResult = await sql`
          INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
          VALUES (${user.id}, ${session.id}, 'professional', 1599, 40, 'completed', NOW(), NOW())
          RETURNING *
        `

        const purchase = purchaseResult[0]
        console.log("💰 Purchase created:", purchase.id)

        // Create project in existing projects table
        const projectResult = await sql`
          INSERT INTO projects (
            user_id,
            purchase_id,
            name,
            gender,
            uploaded_photos,
            status,
            created_at,
            updated_at
          )
          VALUES (
            ${user.id},
            ${purchase.id},
            ${wizardData.projectName},
            ${wizardData.gender},
            ${JSON.stringify(wizardData.uploadedPhotos)},
            'training',
            NOW(),
            NOW()
          )
          RETURNING *
        `

        const project = projectResult[0]
        console.log("✅ Project created:", project.id)

        // Start Astria training with pack ID 928
        try {
          const { createTuneWithPack } = await import("@/lib/astria")

          console.log("🚀 Starting Astria training with pack 928...")

          const astriaResult = await createTuneWithPack("928", {
            title: `${wizardData.projectName} - ${wizardData.gender}`,
            name: `project_${project.id}_${Date.now()}`,
            imageUrls: wizardData.uploadedPhotos,
            projectId: project.id,
            userId: user.id,
          })

          console.log("🎯 Astria training started:", astriaResult.id)

          // Update project with tune_id
          await sql`
            UPDATE projects 
            SET tune_id = ${astriaResult.id}, updated_at = NOW()
            WHERE id = ${project.id}
          `

          console.log("✅ Project updated with tune_id:", astriaResult.id)

          // Clean up wizard session from memory
          deleteWizardData(wizardSessionId)

          console.log("🎉 Wizard flow completed successfully!")
        } catch (astriaError) {
          console.error("❌ Error starting Astria training:", astriaError)

          await sql`
            UPDATE projects 
            SET status = 'failed', updated_at = NOW()
            WHERE id = ${project.id}
          `
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Wizard webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
