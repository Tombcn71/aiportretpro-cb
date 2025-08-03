import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    console.log("🎯 Stripe webhook event:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      console.log("💳 Checkout completed:", {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        metadata: session.metadata,
      })

      // Get wizard session data
      const wizardSessionId = session.metadata?.wizard_session_id

      if (wizardSessionId) {
        console.log("🔍 Looking for wizard session:", wizardSessionId)

        const [wizardSession] = await sql`
          SELECT * FROM wizard_sessions 
          WHERE session_id = ${wizardSessionId}
        `

        if (wizardSession) {
          console.log("✅ Found wizard session, creating project...")

          // Create project with pack 928
          const packId = "928"
          const packName = wizardSession.gender === "man" ? "928 man" : "928 woman"

          const [project] = await sql`
            INSERT INTO projects (
              user_email,
              project_name,
              gender,
              uploaded_photos,
              pack_id,
              pack_name,
              status,
              stripe_session_id,
              created_at,
              updated_at
            ) VALUES (
              ${wizardSession.user_email},
              ${wizardSession.project_name},
              ${wizardSession.gender},
              ${wizardSession.uploaded_photos},
              ${packId},
              ${packName},
              'pending',
              ${session.id},
              NOW(),
              NOW()
            )
            RETURNING *
          `

          console.log("🎯 Project created:", project.id)

          // Start Astria training
          await startAstriaTraining(project)

          // Mark wizard session as completed
          await sql`
            UPDATE wizard_sessions 
            SET completed = true, updated_at = NOW()
            WHERE session_id = ${wizardSessionId}
          `

          console.log("✅ Wizard flow completed successfully")
        } else {
          console.error("❌ Wizard session not found:", wizardSessionId)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}

async function startAstriaTraining(project: any) {
  try {
    console.log("🚀 Starting Astria training for project:", project.id)

    const packId = "928"
    const packName = project.gender === "man" ? "928 man" : "928 woman"

    // Create tune with Astria
    const tuneResponse = await fetch("https://api.astria.ai/tunes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tune: {
          title: packName,
          name: packId,
          callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${project.id}`,
        },
      }),
    })

    if (!tuneResponse.ok) {
      throw new Error(`Astria API error: ${tuneResponse.status}`)
    }

    const tuneData = await tuneResponse.json()
    console.log("✅ Tune created:", tuneData.id)

    // Update project with tune ID
    await sql`
      UPDATE projects 
      SET tune_id = ${tuneData.id}, status = 'training'
      WHERE id = ${project.id}
    `

    console.log("🎯 Training started successfully")
  } catch (error) {
    console.error("❌ Error starting training:", error)

    // Update project status to error
    await sql`
      UPDATE projects 
      SET status = 'error', error_message = ${error.message}
      WHERE id = ${project.id}
    `
  }
}
