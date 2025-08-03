import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { neon } from "@neondatabase/serverless"

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
      console.log("📧 Customer email from Stripe:", session.customer_email)
      console.log("📋 Metadata:", session.metadata)

      const customerEmail = session.customer_email
      const metadata = session.metadata

      if (!customerEmail) {
        console.error("❌ No customer email from Stripe")
        return NextResponse.json({ error: "No customer email" }, { status: 400 })
      }

      if (!metadata?.projectId) {
        console.error("❌ No project ID in metadata")
        return NextResponse.json({ error: "Missing project ID" }, { status: 400 })
      }

      try {
        const projectId = Number.parseInt(metadata.projectId)

        // Get the project that was created during checkout
        const projectResult = await sql`
          SELECT * FROM projects WHERE id = ${projectId} AND status = 'pending_payment'
        `

        if (projectResult.length === 0) {
          console.error("❌ Project not found or already processed")
          return NextResponse.json({ error: "Project not found" }, { status: 400 })
        }

        const project = projectResult[0]
        console.log("📦 Found project:", project.id, project.name)

        // Get user
        const userResult = await sql`
          SELECT * FROM users WHERE id = ${project.user_id}
        `
        const user = userResult[0]

        // Create purchase record
        const purchaseResult = await sql`
          INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
          VALUES (${user.id}, ${session.id}, 'professional', 1999, 40, 'completed', NOW(), NOW())
          RETURNING *
        `

        const purchase = purchaseResult[0]
        console.log("💰 Purchase created:", purchase.id)

        // Update project with purchase and set to training
        await sql`
          UPDATE projects 
          SET purchase_id = ${purchase.id}, status = 'training', updated_at = NOW()
          WHERE id = ${project.id}
        `

        // Start Astria training using existing pattern
        try {
          console.log("🎯 STARTING ASTRIA TRAINING WITH PACK ID 928...")
          console.log("📸 Using photos:", project.uploaded_photos)

          const ASTRIA_API_URL = process.env.ASTRIA_API_URL || "https://api.astria.ai"
          const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY

          if (!ASTRIA_API_KEY) {
            throw new Error("ASTRIA_API_KEY not configured")
          }

          // Use pack endpoint with pack ID 928
          const astriaResponse = await fetch(`${ASTRIA_API_URL}/p/928/tunes`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ASTRIA_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tune: {
                title: `${project.name} - ${project.gender}`,
                name: `project_${project.id}_${Date.now()}`,
                image_urls: project.uploaded_photos,
                callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${project.id}?webhookSecret=${process.env.APP_WEBHOOK_SECRET}`,
              },
            }),
          })

          if (!astriaResponse.ok) {
            const errorText = await astriaResponse.text()
            console.error("❌ Astria API error:", errorText)
            throw new Error(`Astria API error: ${astriaResponse.status}`)
          }

          const astriaResult = await astriaResponse.json()
          console.log("🔥 ASTRIA TRAINING STARTED WITH PACK 928:", astriaResult.id)

          // Update project with tune_id
          await sql`
            UPDATE projects 
            SET tune_id = ${astriaResult.id}, updated_at = NOW()
            WHERE id = ${project.id}
          `

          console.log("🎉 WIZARD FLOW COMPLETED WITH PACK 928!")
        } catch (astriaError) {
          console.error("❌ ASTRIA ERROR:", astriaError)

          await sql`
            UPDATE projects 
            SET status = 'failed', updated_at = NOW()
            WHERE id = ${project.id}
          `
        }

        return NextResponse.json({ received: true, projectId: project.id })
      } catch (error) {
        console.error("❌ Error processing payment:", error)
        return NextResponse.json({ error: "Processing failed" }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
