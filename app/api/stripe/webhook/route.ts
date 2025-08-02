import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// In-memory storage for wizard sessions
const wizardSessions = new Map<string, any>()

export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
}

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
      console.log("📋 Metadata:", session.metadata)

      // Handle wizard flow
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
          photos: wizardData.uploadedPhotos,
        })

        // Get customer email from session or wizard data
        const customerEmail = session.customer_email || wizardData.userEmail

        if (!customerEmail) {
          console.error("❌ No customer email")
          return NextResponse.json({ error: "No customer email" }, { status: 400 })
        }

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
            ${JSON.stringify(wizardData.uploadedPhotos)},
            'training',
            NOW(),
            NOW()
          )
          RETURNING *
        `

        const project = projectResult[0]
        console.log("✅ Project created:", project.id)

        // 🚀 START ASTRIA TRAINING DIRECT POST!
        try {
          console.log("🎯 STARTING ASTRIA TRAINING NOW...")
          console.log("📸 Using Vercel Blob URLs:", wizardData.uploadedPhotos)

          const ASTRIA_API_URL = process.env.ASTRIA_API_URL || "https://api.astria.ai"
          const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY

          if (!ASTRIA_API_KEY) {
            throw new Error("ASTRIA_API_KEY not configured")
          }

          // DIRECT POST TO ASTRIA API
          const astriaResponse = await fetch(`${ASTRIA_API_URL}/tunes`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ASTRIA_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tune: {
                title: `${wizardData.projectName} - ${wizardData.gender}`,
                name: `project_${project.id}_${Date.now()}`,
                image_urls: wizardData.uploadedPhotos, // VERCEL BLOB URLS!
                callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${project.id}?webhookSecret=${process.env.APP_WEBHOOK_SECRET}`,
              },
              pack_id: "clx1qvimu0001hf0jdn5xdlr4", // Professional pack
            }),
          })

          if (!astriaResponse.ok) {
            const errorText = await astriaResponse.text()
            console.error("❌ Astria API error:", {
              status: astriaResponse.status,
              statusText: astriaResponse.statusText,
              body: errorText,
            })
            throw new Error(`Astria API error: ${astriaResponse.status} ${astriaResponse.statusText}`)
          }

          const astriaResult = await astriaResponse.json()
          console.log("🔥 ASTRIA TRAINING STARTED SUCCESSFULLY:", astriaResult)

          // Update project with tune_id
          await sql`
            UPDATE projects 
            SET tune_id = ${astriaResult.id}, updated_at = NOW()
            WHERE id = ${project.id}
          `

          console.log("✅ Project updated with tune_id:", astriaResult.id)

          // Clean up wizard session
          deleteWizardData(wizardSessionId)

          console.log("🎉 WIZARD FLOW COMPLETED - ASTRIA IS TRAINING!")
        } catch (astriaError) {
          console.error("❌ CRITICAL ERROR STARTING ASTRIA TRAINING:", astriaError)

          await sql`
            UPDATE projects 
            SET status = 'failed', updated_at = NOW()
            WHERE id = ${project.id}
          `

          throw astriaError
        }
      }

      // Handle regular pricing flow
      else {
        console.log("💳 Processing regular purchase (non-wizard)")

        const customerEmail = session.customer_email
        if (!customerEmail) {
          console.error("❌ No customer email in regular flow")
          return NextResponse.json({ error: "No customer email" }, { status: 400 })
        }

        // Get or create user for regular flow
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

        // Create purchase for regular flow
        await sql`
          INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
          VALUES (${user.id}, ${session.id}, 'professional', 1999, 40, 'completed', NOW(), NOW())
        `

        console.log("✅ Regular purchase processed for user:", user.id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ CRITICAL WEBHOOK ERROR:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
