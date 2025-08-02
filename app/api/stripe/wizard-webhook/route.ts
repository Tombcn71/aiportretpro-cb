import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("❌ No Stripe signature found")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("🎯 Wizard webhook received event:", event.type)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.CheckoutSession

      console.log("💳 Wizard checkout completed:", session.id)
      console.log("📧 Customer email:", session.customer_email)
      console.log("🗃️ Metadata:", session.metadata)

      if (!session.customer_email) {
        console.error("❌ No customer email in session")
        return NextResponse.json({ error: "No customer email" }, { status: 400 })
      }

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

      console.log("🧙‍♂️ Parsed wizard data:", wizardData)

      // Import database functions
      const { getUserByEmail, createUser, createProject } = await import("@/lib/db")

      // Get or create user
      let user = await getUserByEmail(session.customer_email)
      if (!user) {
        // Create user with minimal data since we only have email from Stripe
        user = await createUser({
          email: session.customer_email,
          name: session.customer_details?.name || "",
          image: "",
        })
      }

      console.log("👤 User:", user.id)

      // Create project with wizard data
      const project = await createProject({
        userId: user.id,
        purchaseId: 0, // No purchase record for wizard flow
        name: wizardData.projectName,
        gender: wizardData.gender,
        outfits: [], // Will be set by Astria
        backgrounds: [], // Will be set by Astria
        uploadedPhotos: wizardData.uploadedPhotos || [],
      })

      console.log("📁 Project created:", project.id)

      // Start Astria training
      try {
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
              callback_url: `${process.env.NEXTAUTH_URL}/api/astria/wizard-webhook/${project.id}`,
            },
          }),
        })

        if (!astriaResponse.ok) {
          const errorText = await astriaResponse.text()
          console.error("❌ Astria training failed:", errorText)

          // Update project status to failed
          const { updateProjectStatus } = await import("@/lib/db")
          await updateProjectStatus(project.id, "failed")

          return NextResponse.json({ error: "Training failed" }, { status: 500 })
        }

        const astriaData = await astriaResponse.json()
        console.log("🚀 Astria training started:", astriaData.id)

        // Update project with tune_id and status
        const { sql } = await import("@/lib/db")
        await sql`
          UPDATE projects 
          SET tune_id = ${astriaData.id}, status = 'training', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${project.id}
        `

        console.log("✅ Project updated with tune_id:", astriaData.id)
      } catch (error) {
        console.error("❌ Error starting Astria training:", error)

        // Update project status to failed
        const { updateProjectStatus } = await import("@/lib/db")
        await updateProjectStatus(project.id, "failed")

        return NextResponse.json({ error: "Training start failed" }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Wizard webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
