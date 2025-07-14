import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("user_id")
    const modelId = url.searchParams.get("model_id")
    const webhookSecret = url.searchParams.get("webhook_secret")

    console.log("🔔 TRAIN WEBHOOK CALLED:", {
      userId,
      modelId,
      webhookSecret: webhookSecret ? "present" : "missing",
      timestamp: new Date().toISOString(),
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    })

    // Verify webhook secret
    if (webhookSecret !== process.env.APP_WEBHOOK_SECRET) {
      console.error("❌ Invalid webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the raw body first
    const rawBody = await request.text()
    console.log("🔔 Raw train webhook body:", rawBody)

    let body
    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error("❌ Failed to parse JSON body:", parseError)
      console.log("Raw body was:", rawBody)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    console.log("🔔 Parsed train webhook body:", body)

    if (!modelId) {
      console.error("❌ No model ID in webhook")
      return NextResponse.json({ error: "No model ID" }, { status: 400 })
    }

    // Handle different webhook formats from Astria
    const webhookStatus = body.status || body.state || body.tune?.status
    const webhookId = body.id || body.tune?.id || "unknown"

    console.log("🔍 Processed train webhook data:", {
      webhookStatus,
      webhookId,
    })

    // Update project status based on training status using Neon
    if (webhookStatus === "finished" || webhookStatus === "completed") {
      await sql`
        UPDATE projects 
        SET status = 'processing', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${Number.parseInt(modelId)}
      `
      console.log(`✅ Model ${modelId} training completed, prompts should start generating`)
    } else if (webhookStatus === "failed" || webhookStatus === "error") {
      await sql`
        UPDATE projects 
        SET status = 'failed', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${Number.parseInt(modelId)}
      `
      console.log(`❌ Model ${modelId} training failed`)
    } else {
      console.log(`🔄 Model ${modelId} training status: ${webhookStatus}`)
    }

    return NextResponse.json({ received: true, processed: true })
  } catch (error) {
    console.error("❌ Train webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
