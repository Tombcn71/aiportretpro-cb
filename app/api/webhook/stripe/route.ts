import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { neon } from "@neondatabase/serverless"
import { getWizardData, deleteWizardData } from "../../wizard/save-data/route"

const sql = neon(process.env.DATABASE_URL!)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  console.log("🔔 STRIPE WEBHOOK RECEIVED")

  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.CheckoutSession

      if (session.metadata?.wizardSessionId) {
        const wizardSessionId = session.metadata.wizardSessionId
        const customerEmail = session.customer_email

        if (!customerEmail) {
          return NextResponse.json({ error: "No customer email" }, { status: 400 })
        }

        // Get wizard data
        const wizardData = getWizardData(wizardSessionId)
        if (!wizardData) {
          return NextResponse.json({ error: "Wizard session not found" }, { status: 400 })
        }

        // Get or create user
        const userResult = await sql`SELECT * FROM users WHERE email = ${customerEmail}`
        let user = userResult[0]

        if (!user) {
          const createUserResult = await sql`
            INSERT INTO users (email, name, image, created_at, updated_at)
            VALUES (${customerEmail}, '', '', NOW(), NOW())
            RETURNING *
          `
          user = createUserResult[0]
        }

        // Create purchase
        const purchaseResult = await sql`
          INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
          VALUES (${user.id}, ${session.id}, 'professional', 1999, 40, 'completed', NOW(), NOW())
          RETURNING *
        `
        const purchase = purchaseResult[0]

        // Create project
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
            ${wizardData.uploadedPhotos},
            'training',
            NOW(),
            NOW()
          )
          RETURNING *
        `
        const project = projectResult[0]

        // Start Astria training
        try {
          const astriaResponse = await fetch(`https://api.astria.ai/p/928/tunes`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tune: {
                title: `${wizardData.projectName} - ${wizardData.gender}`,
                name: `project_${project.id}_${Date.now()}`,
                image_urls: wizardData.uploadedPhotos,
                callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${project.id}?webhookSecret=${process.env.APP_WEBHOOK_SECRET}`,
              },
            }),
          })

          if (astriaResponse.ok) {
            const astriaResult = await astriaResponse.json()
            await sql`UPDATE projects SET tune_id = ${astriaResult.id} WHERE id = ${project.id}`
            console.log("🎉 WIZARD FLOW COMPLETED!")
          }
        } catch (astriaError) {
          console.error("❌ ASTRIA ERROR:", astriaError)
          await sql`UPDATE projects SET status = 'failed' WHERE id = ${project.id}`
        }

        // Clean up
        deleteWizardData(wizardSessionId)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
