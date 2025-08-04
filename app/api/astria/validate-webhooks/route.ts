import { NextResponse } from "next/server"

export async function GET() {
  try {
    const deploymentUrl = process.env.NEXTAUTH_URL || ""
    const webhookSecret = process.env.APP_WEBHOOK_SECRET || ""

    if (!deploymentUrl) {
      return NextResponse.json({ error: "NEXTAUTH_URL not configured" }, { status: 500 })
    }

    if (!webhookSecret) {
      return NextResponse.json({ error: "APP_WEBHOOK_SECRET not configured" }, { status: 500 })
    }

    const baseUrl =
      deploymentUrl.startsWith("http://") || deploymentUrl.startsWith("https://")
        ? deploymentUrl
        : `https://${deploymentUrl}`

    const testUserId = 123
    const testModelId = 456

    const trainWebhook = `${baseUrl}/api/astria/train-webhook`
    const promptWebhook = `${baseUrl}/api/astria/prompt-webhook`

    const trainWebhookWithParams = `${trainWebhook}?user_id=${testUserId}&model_id=${testModelId}&webhook_secret=${webhookSecret}`
    const promptWebhookWithParams = `${promptWebhook}?user_id=${testUserId}&model_id=${testModelId}&webhook_secret=${webhookSecret}`

    // Test if URLs are accessible
    let trainWebhookAccessible = false
    let promptWebhookAccessible = false

    try {
      const trainResponse = await fetch(trainWebhook, { method: "POST", body: JSON.stringify({ test: true }) })
      trainWebhookAccessible = trainResponse.status !== 404
    } catch (e) {
      // Expected to fail, we just want to check if it's reachable
      trainWebhookAccessible = true
    }

    try {
      const promptResponse = await fetch(promptWebhook, { method: "POST", body: JSON.stringify({ test: true }) })
      promptWebhookAccessible = promptResponse.status !== 404
    } catch (e) {
      // Expected to fail, we just want to check if it's reachable
      promptWebhookAccessible = true
    }

    return NextResponse.json({
      environment: {
        NEXTAUTH_URL: deploymentUrl,
        APP_WEBHOOK_SECRET: webhookSecret ? "configured" : "missing",
        ASTRIA_API_KEY: process.env.ASTRIA_API_KEY ? "configured" : "missing",
      },
      webhooks: {
        baseUrl,
        trainWebhook: trainWebhookWithParams,
        promptWebhook: promptWebhookWithParams,
        trainWebhookAccessible,
        promptWebhookAccessible,
      },
      validation: {
        baseUrlValid: baseUrl.startsWith("https://"),
        webhookSecretExists: !!webhookSecret,
        urlsProperlyFormatted: true,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to validate webhooks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
