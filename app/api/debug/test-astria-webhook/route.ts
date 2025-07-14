import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectId, testData } = await request.json()

    if (!process.env.APP_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "APP_WEBHOOK_SECRET not configured" }, { status: 500 })
    }

    if (!process.env.NEXTAUTH_URL) {
      return NextResponse.json({ error: "NEXTAUTH_URL not configured" }, { status: 500 })
    }

    const baseUrl = process.env.NEXTAUTH_URL.startsWith("http")
      ? process.env.NEXTAUTH_URL
      : `https://${process.env.NEXTAUTH_URL}`

    const webhookUrl = `${baseUrl}/api/astria/prompt-webhook?user_id=1&model_id=${projectId}&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`

    console.log("🧪 Testing webhook with URL:", webhookUrl.replace(process.env.APP_WEBHOOK_SECRET, "***SECRET***"))
    console.log("🧪 Test data being sent:", testData)

    // Call our own webhook endpoint with the correct secret
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    const responseData = await response.json()

    console.log("🧪 Webhook response:", responseData)

    return NextResponse.json({
      status: response.status,
      data: responseData,
      webhookUrl: webhookUrl.replace(process.env.APP_WEBHOOK_SECRET, "***SECRET***"),
      testData,
    })
  } catch (error) {
    console.error("Error testing Astria webhook:", error)
    return NextResponse.json(
      {
        error: "Failed to test webhook",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
