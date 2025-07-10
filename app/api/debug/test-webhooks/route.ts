import { NextResponse } from "next/server"

export async function POST() {
  try {
    if (!process.env.APP_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "APP_WEBHOOK_SECRET not configured" }, { status: 500 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || ""
    const webhookSecret = process.env.APP_WEBHOOK_SECRET
    const testUserId = 1
    const testModelId = 999

    const trainWebhookUrl = `${baseUrl}/api/astria/train-webhook?user_id=${testUserId}&model_id=${testModelId}&webhook_secret=${webhookSecret}`
    const promptWebhookUrl = `${baseUrl}/api/astria/prompt-webhook?user_id=${testUserId}&model_id=${testModelId}&webhook_secret=${webhookSecret}`

    // Test train webhook
    let trainResult
    try {
      const trainResponse = await fetch(trainWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "test-tune-123",
          status: "finished",
          title: "Test Training",
        }),
      })
      trainResult = {
        status: trainResponse.status,
        success: trainResponse.ok,
        response: await trainResponse.text(),
      }
    } catch (error) {
      trainResult = {
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // Test prompt webhook
    let promptResult
    try {
      const promptResponse = await fetch(promptWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "test-prompt-123",
          status: "finished",
          images: ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
        }),
      })
      promptResult = {
        status: promptResponse.status,
        success: promptResponse.ok,
        response: await promptResponse.text(),
      }
    } catch (error) {
      promptResult = {
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    return NextResponse.json({
      train_webhook: trainResult,
      prompt_webhook: promptResult,
      webhook_urls: {
        train: trainWebhookUrl.replace(webhookSecret, "***"),
        prompt: promptWebhookUrl.replace(webhookSecret, "***"),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Webhook test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
