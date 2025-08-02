import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

async function getStripe() {
  const { stripe } = await import("@/lib/stripe")
  return stripe
}

export async function POST(request: NextRequest) {
  console.log("🔔 WEBHOOK RECEIVED at", new Date().toISOString())

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    console.log("❌ No signature")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("❌ No webhook secret")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  try {
    const stripe = await getStripe()
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    console.log("✅ Event type:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      console.log("💳 Processing checkout session:", session.id)

      // Check if this is wizard flow
      const isWizardFlow = session.metadata?.flow === "wizard"

      if (isWizardFlow) {
        console.log("🧙‍♂️ Processing wizard flow")

        // Get wizard data from metadata
        const wizardDataString = session.metadata?.wizardData
        if (!wizardDataString) {
          console.error("❌ No wizard data in metadata")
          return NextResponse.json({ error: "No wizard data" }, { status: 400 })
        }

        let wizardData
        try {
          wizardData = JSON.parse(wizardDataString)
        } catch (err) {
          console.error("❌ Failed to parse wizard data:", err)
          return NextResponse.json({ error: "Invalid wizard data" }, { status: 400 })
        }

        // Get user by email
        const userResult = await sql`
          SELECT * FROM users WHERE email = ${session.customer_email}
        `

        let userId
        if (userResult[0]) {
          userId = userResult[0].id
        } else {
          // Create user if doesn't exist
          const newUser = await sql`
            INSERT INTO users (email, name, image, created_at, updated_at)
            VALUES (${session.customer_email}, ${session.customer_details?.name || "User"}, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id
          `
          userId = newUser[0].id
        }

        console.log("👤 User ID:", userId)

        // Create project with wizard data
        const projectResult = await sql`
          INSERT INTO projects (
            user_id, 
            name, 
            gender, 
            outfits, 
            backgrounds, 
            uploaded_photos, 
            status, 
            credits_used,
            created_at,
            updated_at
          )
          VALUES (
            ${userId}, 
            ${wizardData.projectName}, 
            ${wizardData.gender}, 
            ${JSON.stringify([])}, 
            ${JSON.stringify([])}, 
            ${JSON.stringify(wizardData.uploadedPhotos)}, 
            'training', 
            0,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
          RETURNING id
        `

        const projectId = projectResult[0].id
        console.log("📁 Project created:", projectId)

        // Start Astria training using existing pack system
        try {
          const { trainWithPack } = await import("@/lib/astria-packs")

          const packId = "clx1qf18h0001mf088cjmehkz" // Use existing pack ID

          const astriaResult = await trainWithPack({
            packId: packId,
            images: wizardData.uploadedPhotos,
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            projectId: projectId,
          })

          console.log("🚀 Astria training started:", astriaResult.id)

          // Update project with tune_id
          await sql`
            UPDATE projects 
            SET tune_id = ${astriaResult.id.toString()}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${projectId}
          `

          console.log("✅ Wizard project created and training started")

          return NextResponse.json({
            received: true,
            projectId,
            tuneId: astriaResult.id,
            message: "Wizard project created and training started",
          })
        } catch (error) {
          console.error("❌ Error starting training:", error)

          // Update project status to failed
          await sql`
            UPDATE projects 
            SET status = 'failed', updated_at = CURRENT_TIMESTAMP
            WHERE id = ${projectId}
          `

          return NextResponse.json({ error: "Training failed to start" }, { status: 500 })
        }
      } else {
        console.log("💳 Processing regular credit flow")

        // Original credit-based flow (unchanged)
        const purchaseResult = await sql`
          UPDATE purchases 
          SET status = 'completed', updated_at = CURRENT_TIMESTAMP
          WHERE stripe_session_id = ${session.id}
          RETURNING user_id, id
        `

        if (purchaseResult[0]) {
          const userId = purchaseResult[0].user_id
          console.log(`👤 Adding credit for user ${userId}`)

          try {
            const creditResult = await sql`
              INSERT INTO credits (user_id, credits, created_at, updated_at)
              VALUES (${userId}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              ON CONFLICT (user_id) 
              DO UPDATE SET 
                credits = credits.credits + 1,
                updated_at = CURRENT_TIMESTAMP
              RETURNING credits
            `

            console.log(`✅ User ${userId} now has ${creditResult[0]?.credits} credits`)

            return NextResponse.json({
              received: true,
              userId,
              creditsAdded: 1,
              totalCredits: creditResult[0]?.credits,
            })
          } catch (creditError) {
            console.error("❌ Credit error:", creditError)

            // Fallback: try to update existing or create new
            const existingCredit = await sql`
              SELECT credits FROM credits WHERE user_id = ${userId}
            `

            if (existingCredit[0]) {
              const updateResult = await sql`
                UPDATE credits 
                SET credits = credits + 1, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ${userId}
                RETURNING credits
              `
              console.log(`✅ Updated credits for user ${userId}: ${updateResult[0]?.credits}`)

              return NextResponse.json({
                received: true,
                userId,
                creditsAdded: 1,
                totalCredits: updateResult[0]?.credits,
              })
            } else {
              const newCredit = await sql`
                INSERT INTO credits (user_id, credits, created_at, updated_at)
                VALUES (${userId}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                RETURNING credits
              `
              console.log(`✅ Created new credits for user ${userId}: ${newCredit[0]?.credits}`)

              return NextResponse.json({
                received: true,
                userId,
                creditsAdded: 1,
                totalCredits: newCredit[0]?.credits,
              })
            }
          }
        } else {
          console.log("❌ No purchase found for session:", session.id)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      {
        error: "Webhook error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    )
  }
}
