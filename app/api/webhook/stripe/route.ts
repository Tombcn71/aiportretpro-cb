import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { getUserByEmail, createUser, sql } from "@/lib/db"
import { CreditManager } from "@/lib/credits"
import { trainWithPack } from "@/lib/astria-packs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  console.log("🔔 WEBHOOK RECEIVED at", new Date().toISOString())

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    console.log("❌ No signature")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("❌ No webhook secret")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("✅ Event type:", event.type)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    console.log("💳 Checkout completed:", session.id)
    console.log("📧 Customer email:", session.customer_email)
    console.log("🗃️ Metadata:", session.metadata)

    if (!session.customer_email) {
      console.error("❌ No customer email in session")
      return NextResponse.json({ error: "No customer email" }, { status: 400 })
    }

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

      // Get or create user
      let user = await getUserByEmail(session.customer_email)
      if (!user) {
        user = await createUser({
          email: session.customer_email,
          name: session.customer_details?.name || "",
          image: "",
        })
      }

      console.log("👤 User:", user.id)

      // Create project
      const result = await sql`
        INSERT INTO projects (user_id, name, gender, outfits, backgrounds, uploaded_photos, status, credits_used)
        VALUES (${user.id}, ${wizardData.projectName}, ${wizardData.gender}, ${JSON.stringify([])}, ${JSON.stringify([])}, ${JSON.stringify(wizardData.uploadedPhotos)}, 'training', 0)
        RETURNING id
      `
      const projectId = result[0].id

      console.log("📁 Project created:", projectId)

      // Start pack-based training using existing system
      try {
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
          SET tune_id = ${astriaResult.id.toString()}, status = 'training'
          WHERE id = ${projectId}
        `

        console.log("✅ Wizard project created and training started")
      } catch (error) {
        console.error("❌ Error starting training:", error)

        // Update project status to failed
        await sql`
          UPDATE projects 
          SET status = 'failed'
          WHERE id = ${projectId}
        `
      }
    } else {
      console.log("💳 Processing regular credit flow")

      // Original credit-based flow (unchanged)
      let user = await getUserByEmail(session.customer_email)
      if (!user) {
        user = await createUser({
          email: session.customer_email,
          name: session.customer_details?.name || "",
          image: "",
        })
      }

      console.log("👤 User found/created:", user.id)

      // Add credits using existing system
      await CreditManager.addCredits(user.id, 1, `Stripe payment: ${session.id}`)
      console.log("✅ Credit added successfully")
    }
  }

  return NextResponse.json({ received: true })
}
