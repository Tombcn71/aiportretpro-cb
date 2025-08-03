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

      // 🔍 CHECK IF SESSION ALREADY PROCESSED
      const existingPurchase = await sql`
        SELECT id FROM purchases WHERE stripe_session_id = ${session.id}
      `

      if (existingPurchase.length > 0) {
        console.log("⚠️ Session already processed:", session.id)
        return NextResponse.json({ received: true, message: "Already processed" })
      }

      const customerEmail = session.customer_email
      if (!customerEmail) {
        console.error("❌ No customer email from Stripe")
        return NextResponse.json({ error: "No customer email" }, { status: 400 })
      }

      // Get wizard data from metadata
      const metadata = session.metadata
      if (!metadata?.projectName || !metadata?.gender || !metadata?.wizardSessionId) {
        console.error("❌ Missing wizard metadata")
        return NextResponse.json({ error: "Missing wizard metadata" }, { status: 400 })
      }

      // Get uploaded photos from wizard session
      let uploadedPhotos: string[] = []
      try {
        const photosResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/wizard/get-data`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wizardSessionId: metadata.wizardSessionId }),
        })
        if (photosResponse.ok) {
          const data = await photosResponse.json()
          uploadedPhotos = data.uploadedPhotos || []
        }
      } catch (error) {
        console.error("❌ Could not get wizard data:", error)
      }

      console.log("📸 Photos to use:", uploadedPhotos)

      // Get or create user
      const userResult = await sql`
        SELECT * FROM users WHERE email = ${customerEmail}
      `

      let user = userResult[0]
      if (!user) {
        const createUserResult = await sql`
          INSERT INTO users (email, name, image, created_at, updated_at)
          VALUES (${customerEmail}, '', '', NOW(), NOW())
          RETURNING *
        `
        user = createUserResult[0]
      }

      console.log("👤 User:", user.id, user.email)

      // Create purchase record
      const purchaseResult = await sql`
        INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
        VALUES (${user.id}, ${session.id}, 'professional', 1999, 40, 'completed', NOW(), NOW())
        RETURNING *
      `

      const purchase = purchaseResult[0]
      console.log("💰 Purchase created:", purchase.id)

      // Create project - FIX: Don't JSON.stringify the photos array
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
          ${metadata.projectName},
          ${metadata.gender},
          ${uploadedPhotos},
          'training',
          NOW(),
          NOW()
        )
        RETURNING *
      `

      const project = projectResult[0]
      console.log("✅ Project created:", project.id)

      // 🚀 START ASTRIA TRAINING WITH PACK ID 928!
      try {
        console.log("🎯 STARTING ASTRIA TRAINING WITH PACK ID 928...")
        console.log("📸 Using photos:", uploadedPhotos)

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
              title: `${metadata.projectName} - ${metadata.gender}`,
              name: `project_${project.id}_${Date.now()}`,
              image_urls: uploadedPhotos,
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
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
