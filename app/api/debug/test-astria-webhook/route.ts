import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Test payload that mimics Astria's webhook format
    const testPayload = {
      id: "test_prompt_123",
      images: ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
      status: "finished",
    }

    // Send test webhook to our prompt webhook endpoint
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/astria/prompt-webhook?user_id=1&model_id=39&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    })

    let result
    try {
      result = await response.json()
    } catch (e) {
      result = await response.text()
    }

    return NextResponse.json({
      success: true,
      status: response.status,
      data: result,
      webhookUrl: webhookUrl.replace(process.env.APP_WEBHOOK_SECRET, "***SECRET***"),
    })
  } catch (error) {
    console.error("Test Astria webhook error:", error)
    return NextResponse.json({ error: "Failed to test Astria webhook", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
