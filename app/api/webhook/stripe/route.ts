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

export function saveWizardData(sessionId: string, data: any) {
  wizardSessions.set(sessionId, data)
  console.log("💾 Wizard data saved:", sessionId)
}

export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
}

// Function to sanitize name for Astria API
function sanitizeAstriaName(name: string): string {
  const sanitized = name
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (sanitized.length < 2) {
    return "Professional Headshots"
  }

  return sanitized.substring(0, 50)
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
      console.log("📧 Customer email from Stripe:", session.customer_email)
      console.log("📋 Metadata:", session.metadata)

      // Handle wizard flow
      if (session.metadata?.type === "wizard") {
        try {
          const wizardSessionId = session.metadata.session_id
          const customerEmail = session.customer_email

          console.log("🧙‍♂️ Processing wizard flow")
          console.log("Session ID:", wizardSessionId)
          console.log("Customer email:", customerEmail)

          if (!wizardSessionId) {
            console.error("❌ No wizard session ID in metadata")
            return NextResponse.json({ error: "No wizard session ID" }, { status: 400 })
          }

          if (!customerEmail) {
            console.error("❌ No customer email from Stripe")
            return NextResponse.json({ error: "No customer email" }, { status: 400 })
          }

          // Get wizard data from memory
          const wizardData = getWizardData(wizardSessionId)
          console.log("📋 Wizard data found:", !!wizardData)

          if (!wizardData) {
            console.error("❌ Wizard session not found in memory:", wizardSessionId)
            console.log("Available sessions:", Array.from(wizardSessions.keys()))

            const fallbackData = {
              projectName: session.metadata.project_name || "Untitled Project",
              gender: session.metadata.gender || "man",
              uploadedPhotos: [],
              userEmail: session.metadata.user_email || customerEmail,
            }

            console.log("🔄 Using fallback data:", fallbackData)

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

            const purchaseResult = await sql`
              INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
              VALUES (${user.id}, ${session.id}, 'professional', 1999, 40, 'completed', NOW(), NOW())
              RETURNING *
            `

            const purchase = purchaseResult[0]
            console.log("💰 Purchase created:", purchase.id)

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
                ${fallbackData.projectName},
                ${fallbackData.gender},
                ARRAY[]::text[],
                'pending_upload',
                NOW(),
                NOW()
              )
              RETURNING *
            `

            const project = projectResult[0]
            console.log("⚠️ Project created without photos:", project.id)

            return NextResponse.json({
              received: true,
              message: "Purchase processed but photos missing - user needs to re-upload",
            })
          }

          console.log("✅ Found wizard data:", {
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            photoCount: wizardData.uploadedPhotos?.length || 0,
          })

          console.log("👤 Getting/creating user...")
          const userResult = await sql`
            SELECT * FROM users WHERE email = ${customerEmail}
          `

          let user = userResult[0]
          if (!user) {
            console.log("Creating new user...")
            const createUserResult = await sql`
              INSERT INTO users (email, name, image, created_at, updated_at)
              VALUES (${customerEmail}, '', '', NOW(), NOW())
              RETURNING *
            `
            user = createUserResult[0]
          }

          console.log("👤 User:", user.id, user.email)

          console.log("💰 Creating purchase...")
          const purchaseResult = await sql`
            INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
            VALUES (${user.id}, ${session.id}, 'professional', 1999, 40, 'completed', NOW(), NOW())
            RETURNING *
          `

          const purchase = purchaseResult[0]
          console.log("💰 Purchase created:", purchase.id)

          console.log("📁 Creating project...")
          console.log("📸 Photos to save:", wizardData.uploadedPhotos)

          const photosArray = wizardData.uploadedPhotos || []

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
              ${photosArray},
              'training',
              NOW(),
              NOW()
            )
            RETURNING *
          `

          const project = projectResult[0]
          console.log("✅ Project created:", project.id)

          // 🚀 START ASTRIA TRAINING!
          if (wizardData.uploadedPhotos && wizardData.uploadedPhotos.length > 0) {
            try {
              console.log("🎯 STARTING ASTRIA TRAINING...")
              console.log("📸 Using photos:", wizardData.uploadedPhotos)

              const ASTRIA_API_URL = process.env.ASTRIA_API_URL || "https://api.astria.ai"
              const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY

              if (!ASTRIA_API_KEY) {
                throw new Error("ASTRIA_API_KEY not configured")
              }

              const sanitizedName = sanitizeAstriaName(wizardData.projectName)
              console.log("🧹 Sanitized name:", sanitizedName)

              // Use pack ID 8208 for both men and women
              const PACK_ID = "8208"

              const astriaResponse = await fetch(`${ASTRIA_API_URL}/tunes`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${ASTRIA_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  tune: {
                    title: `${sanitizedName} ${wizardData.gender}`,
                    name: sanitizedName,
                    image_urls: wizardData.uploadedPhotos,
                    callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${project.id}?webhookSecret=${process.env.APP_WEBHOOK_SECRET}`,
                  },
                  pack_id: PACK_ID,
                }),
              })

              if (!astriaResponse.ok) {
                const errorText = await astriaResponse.text()
                console.error("❌ Astria API error:", errorText)
                throw new Error(`Astria API error: ${astriaResponse.status}`)
              }

              const astriaResult = await astriaResponse.json()
              console.log("🔥 ASTRIA TRAINING STARTED:", astriaResult.id)

              await sql`
                UPDATE projects 
                SET tune_id = ${astriaResult.id}, updated_at = NOW()
                WHERE id = ${project.id}
              `

              console.log("🎉 ASTRIA TRAINING STARTED SUCCESSFULLY!")
            } catch (astriaError) {
              console.error("❌ ASTRIA ERROR:", astriaError)

              await sql`
                UPDATE projects 
                SET status = 'failed', updated_at = NOW()
                WHERE id = ${project.id}
              `
            }
          } else {
            console.log("⚠️ No photos to train with")
            await sql`
              UPDATE projects 
              SET status = 'pending_upload', updated_at = NOW()
              WHERE id = ${project.id}
            `
          }

          deleteWizardData(wizardSessionId)

          console.log("🎉 WIZARD FLOW COMPLETED!")
        } catch (wizardError) {
          console.error("❌ WIZARD FLOW ERROR:", wizardError)
          return NextResponse.json({ error: "Wizard flow failed" }, { status: 500 })
        }
      }

      // Handle regular pricing flow
      else {
        try {
          console.log("💳 Processing regular purchase")
          const customerEmail = session.customer_email

          if (!customerEmail) {
            console.error("❌ No customer email")
            return NextResponse.json({ error: "No customer email" }, { status: 400 })
          }

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

          await sql`
            INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included, status, created_at, updated_at)
            VALUES (${user.id}, ${session.id}, 'professional', 1999, 40, 'completed', NOW(), NOW())
          `

          console.log("✅ Regular purchase processed")
        } catch (regularError) {
          console.error("❌ REGULAR PURCHASE ERROR:", regularError)
          return NextResponse.json({ error: "Regular purchase failed" }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: "Webhook failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
