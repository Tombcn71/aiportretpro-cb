import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectId, testData } = await request.json()

    // Use the correct webhook secret from environment
    const webhookSecret = process.env.APP_WEBHOOK_SECRET
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/astria/prompt-webhook?user_id=1&model_id=${projectId}&webhook_secret=${webhookSecret}`

    // Make the webhook call server-side
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    })

    const responseData = await response.json()

    return NextResponse.json({
      status: response.status,
      data: responseData,
      webhookUrl: webhookUrl.replace(webhookSecret, "***SECRET***"), // Hide secret in response
    })
  } catch (error) {
    console.error("Test Astria webhook error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
