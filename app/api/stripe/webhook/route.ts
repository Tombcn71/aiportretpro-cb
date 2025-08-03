import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = headers()
  const sig = headersList.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: any) {
    console.error("❌ WEBHOOK SIGNATURE ERROR:", err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  console.log("✅ WEBHOOK EVENT:", event.type, event.id)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    console.log("💳 CHECKOUT COMPLETED:", {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      metadata: session.metadata,
    })

    try {
      // Check if this session was already processed
      const existingPurchase = await sql`
        SELECT id FROM purchases WHERE stripe_session_id = ${session.id}
      `

      if (existingPurchase.length > 0) {
        console.log("⚠️ Session already processed:", session.id)
        return NextResponse.json({ received: true })
      }

      // Get wizard data
      const wizardSessionId = session.metadata?.wizardSessionId
      if (!wizardSessionId) {
        throw new Error("No wizard session ID in metadata")
      }

      // Get wizard data from database
      let wizardData
      try {
        const wizardResult = await sql`
          SELECT * FROM wizard_sessions WHERE session_id = ${wizardSessionId}
        `
        if (wizardResult.length > 0) {
          const row = wizardResult[0]
          wizardData = {
            projectName: row.project_name,
            gender: row.gender,
            uploadedPhotos: Array.isArray(row.uploaded_photos)
              ? row.uploaded_photos
              : JSON.parse(row.uploaded_photos || "[]"),
            userEmail: row.user_email,
          }
        }
      } catch (dbError) {
        console.log("⚠️ Database read failed, using metadata")
      }

      if (!wizardData) {
        // Fallback to metadata
        wizardData = {
          projectName: session.metadata?.projectName || "Untitled",
          gender: session.metadata?.gender || "man",
          uploadedPhotos: [],
          userEmail: session.customer_details?.email || session.metadata?.userEmail,
        }
      }

      console.log("📸 Photos to use:", wizardData.uploadedPhotos)

      // Get or create user
      const userResult = await sql`
        SELECT * FROM users WHERE email = ${wizardData.userEmail}
      `

      let user = userResult[0]
      if (!user) {
        const createUserResult = await sql`
          INSERT INTO users (email, name, image, created_at, updated_at)
          VALUES (${wizardData.userEmail}, '', '', NOW(), NOW())
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

      // Create project - FIXED: Use proper array format for PostgreSQL
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
          ${wizardData.uploadedPhotos}::text[],
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
        console.log("📸 Using photos:", wizardData.uploadedPhotos)

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
              title: `${wizardData.projectName} - ${wizardData.gender}`,
              name: `project_${project.id}_${Date.now()}`,
              image_urls: wizardData.uploadedPhotos,
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

      console.log("✅ WEBHOOK COMPLETED SUCCESSFULLY")
      return NextResponse.json({ received: true })
    } catch (error) {
      console.error("❌ WEBHOOK ERROR:", error)
      return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
