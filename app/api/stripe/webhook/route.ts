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
            uploadedPhotos: JSON.parse(row.uploaded_photos),
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

      // Create purchase record
      const purchaseResult = await sql`
        INSERT INTO purchases (
          stripe_session_id,
          user_email,
          amount,
          currency,
          status,
          created_at,
          updated_at
        ) VALUES (
          ${session.id},
          ${wizardData.userEmail},
          ${session.amount_total},
          ${session.currency},
          'completed',
          NOW(),
          NOW()
        )
        RETURNING id
      `

      const purchaseId = purchaseResult[0].id
      console.log("✅ Purchase created:", purchaseId)

      // Create project
      const projectResult = await sql`
        INSERT INTO projects (
          user_email,
          name,
          gender,
          uploaded_photos,
          status,
          pack_id,
          created_at,
          updated_at
        ) VALUES (
          ${wizardData.userEmail},
          ${wizardData.projectName},
          ${wizardData.gender},
          ${wizardData.uploadedPhotos},
          'processing',
          '928',
          NOW(),
          NOW()
        )
        RETURNING id
      `

      const projectId = projectResult[0].id
      console.log("✅ Project created:", projectId)

      // Start Astria training
      const astriaResponse = await fetch("https://api.astria.ai/tunes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tune: {
            title: `${wizardData.projectName} - ${wizardData.gender}`,
            name: wizardData.gender === "man" ? "man" : "woman",
            image_urls: wizardData.uploadedPhotos,
            callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${projectId}`,
          },
        }),
      })

      if (!astriaResponse.ok) {
        const errorText = await astriaResponse.text()
        console.error("❌ ASTRIA ERROR:", astriaResponse.status, errorText)
        throw new Error(`Astria API error: ${astriaResponse.status}`)
      }

      const astriaData = await astriaResponse.json()
      console.log("✅ ASTRIA TRAINING STARTED:", astriaData.id)

      // Update project with tune_id
      await sql`
        UPDATE projects 
        SET tune_id = ${astriaData.id.toString()}, updated_at = NOW()
        WHERE id = ${projectId}
      `

      console.log("✅ WEBHOOK COMPLETED SUCCESSFULLY")
      return NextResponse.json({ received: true })
    } catch (error) {
      console.error("❌ WEBHOOK ERROR:", error)
      return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
