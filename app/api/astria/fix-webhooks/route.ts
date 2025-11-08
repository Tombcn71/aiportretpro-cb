import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    console.log("🔧 Fixing webhook configuration...")

    const baseUrl = process.env.NEXTAUTH_URL
    const webhookSecret = process.env.APP_WEBHOOK_SECRET

    if (!baseUrl || !webhookSecret) {
      return NextResponse.json(
        {
          error: "Missing configuration",
          missing: {
            NEXTAUTH_URL: !baseUrl,
            APP_WEBHOOK_SECRET: !webhookSecret,
          },
        },
        { status: 500 },
      )
    }

    // Test webhook endpoints
    const trainWebhookUrl = `${baseUrl}/api/astria/train-webhook?user_id=1&model_id=999&webhook_secret=${webhookSecret}`
    const promptWebhookUrl = `${baseUrl}/api/astria/prompt-webhook?user_id=1&model_id=999&webhook_secret=${webhookSecret}`

    console.log("Testing webhook URLs:")
    console.log("Train:", trainWebhookUrl.replace(webhookSecret, "***"))
    console.log("Prompt:", promptWebhookUrl.replace(webhookSecret, "***"))

    // Test train webhook
    let trainTest
    try {
      const response = await fetch(trainWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "test-123",
          status: "finished",
          title: "Test",
        }),
      })
      trainTest = {
        status: response.status,
        ok: response.ok,
        text: await response.text(),
      }
    } catch (error) {
      trainTest = { error: error instanceof Error ? error.message : String(error) }
    }

    // Test prompt webhook
    let promptTest
    try {
      const response = await fetch(promptWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "test-456",
          status: "finished",
          images: ["https://example.com/test.jpg"],
        }),
      })
      promptTest = {
        status: response.status,
        ok: response.ok,
        text: await response.text(),
      }
    } catch (error) {
      promptTest = { error: error instanceof Error ? error.message : String(error) }
    }

    // Check recent webhook calls in logs (if we had a webhook_logs table)
    let recentWebhookCalls: any[] = []
    try {
      const webhookLogs = await sql`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'webhook_logs'
      `
      if (webhookLogs.length > 0) {
        recentWebhookCalls = await sql`
          SELECT * FROM webhook_logs 
          ORDER BY created_at DESC 
          LIMIT 10
        `
      }
    } catch (error) {
      console.log("No webhook logs table found")
    }

    return NextResponse.json({
      webhook_config: {
        base_url: baseUrl,
        webhook_secret_configured: !!webhookSecret,
        train_webhook: trainWebhookUrl.replace(webhookSecret, "***"),
        prompt_webhook: promptWebhookUrl.replace(webhookSecret, "***"),
      },
      webhook_tests: {
        train_webhook: trainTest,
        prompt_webhook: promptTest,
      },
      recent_webhook_calls: recentWebhookCalls,
      recommendations: [
        trainTest?.ok ? "✅ Train webhook working" : "❌ Train webhook not working",
        promptTest?.ok ? "✅ Prompt webhook working" : "❌ Prompt webhook not working",
        "Run the status check to recover existing images from Astria",
        "Check Astria dashboard to see if webhooks are being called",
      ],
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Webhook fix failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
