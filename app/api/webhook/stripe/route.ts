import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("🎯 Webhook event:", event.type)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    console.log("💳 Checkout completed:", session.id)
    console.log("🏷️ Metadata:", session.metadata)

    try {
      let projectId: string | undefined

      // Optie 1: Probeer projectId uit metadata te halen
      if (session.metadata?.projectId) {
        projectId = session.metadata.projectId
      }

      // Optie 2: Haal projectId uit client_reference_id
      else if (session.client_reference_id) {
        projectId = session.client_reference_id
        console.log("📋 Using client_reference_id as projectId:", projectId)
      }

      // Optie 3: Zoek project op basis van userEmail en status 'photos_uploaded'
      else if (session.metadata?.userEmail || session.customer_details?.email) {
        const userEmail = session.metadata?.userEmail || session.customer_details?.email
        console.log("🔍 Searching for photos_uploaded project for user:", userEmail)

        const unpaidProjectResult = await sql`
          SELECT * FROM projects 
          WHERE guest_email = ${userEmail}
          AND status = 'photos_uploaded'
          ORDER BY created_at DESC
          LIMIT 1
        `

        if (unpaidProjectResult[0]) {
          projectId = unpaidProjectResult[0].id.toString()
          console.log("🎯 Found photos_uploaded project:", projectId)
        }
      }

      const { projectName, gender, userEmail, packId, source, photoCount, wizardSessionId } = session.metadata || {}

      if (!projectId || !userEmail) {
        console.error("❌ Missing required data:", {
          projectId,
          userEmail,
          hasMetadata: !!session.metadata,
          clientReferenceId: session.client_reference_id,
        })

        // Log alle beschikbare data voor debugging
        console.log("🔍 Available session data:", {
          id: session.id,
          metadata: session.metadata,
          client_reference_id: session.client_reference_id,
          customer_email: session.customer_details?.email,
          amount_total: session.amount_total,
        })

        return NextResponse.json({ error: "Missing project ID or user email" }, { status: 400 })
      }

      console.log("📦 Processing project ID:", projectId)
      console.log("📧 User email:", userEmail)

      // Get user
      const userResult = await sql`
        SELECT * FROM users WHERE email = ${userEmail}
      `
      const user = userResult[0]

      if (!user) {
        console.error("❌ User not found:", userEmail)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Record the purchase
      await sql`
        INSERT INTO purchases (
          user_id,
          stripe_session_id,
          plan_type,
          amount,
          headshots_included,
          status,
          created_at,
          updated_at
        )
        VALUES (
          ${user.id},
          ${session.id},
          'professional',
          ${session.amount_total || 1999},
          40,
          'completed',
          NOW(),
          NOW()
        )
      `

      // Update project status to paid
      await sql`
        UPDATE projects 
        SET 
          status = 'paid',
          stripe_session_id = ${session.id},
          updated_at = NOW()
        WHERE id = ${Number.parseInt(projectId)}
      `

      console.log("✅ Project updated to paid status")

      // Get project details for Astria training
      const projectResult = await sql`
        SELECT * FROM projects WHERE id = ${Number.parseInt(projectId)}
      `
      const project = projectResult[0]

      if (!project) {
        console.error("❌ Project not found:", projectId)
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      // Start Astria training
      console.log("🚀 Starting Astria training for project:", projectId)

      const uploadedPhotos = project.uploaded_photos

      // Call existing Astria training API
      const astriaResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/projects/create-with-pack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: project.name,
          gender: project.gender,
          uploadedPhotos: uploadedPhotos,
          userEmail: userEmail,
          packId: packId || "928",
          existingProjectId: Number.parseInt(projectId),
        }),
      })

      if (!astriaResponse.ok) {
        const errorText = await astriaResponse.text()
        console.error("❌ Failed to start Astria training:", errorText)

        // Update project status to error
        await sql`
          UPDATE projects 
          SET status = 'error', updated_at = NOW()
          WHERE id = ${Number.parseInt(projectId)}
        `

        return NextResponse.json(
          {
            error: "Failed to start training",
            details: errorText,
          },
          { status: 500 },
        )
      } else {
        console.log("✅ Astria training started successfully")
        // Update project status to training
        await sql`
          UPDATE projects 
          SET status = 'training', updated_at = NOW()
          WHERE id = ${Number.parseInt(projectId)}
        `
      }

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error("❌ Error processing webhook:", error)
      return NextResponse.json({ error: "Processing failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
