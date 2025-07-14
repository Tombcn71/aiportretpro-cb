import { NextResponse } from "next/server"

export async function GET() {
  const webhookUrl = `${process.env.NEXTAUTH_URL}/api/astria/prompt-webhook?user_id=1&model_id=39&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`

  const testPayload = {
    id: "test_prompt_123",
    status: "finished",
    images: ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    })

    const data = await response.json()

    return NextResponse.json({
      status: response.status,
      data,
      webhookUrl: webhookUrl.replace(process.env.APP_WEBHOOK_SECRET!, "***SECRET***"),
    })
  } catch (error) {
    console.error("Astria webhook test error:", error)
    return NextResponse.json({ error: "Test failed", details: error.message }, { status: 500 })
  }
}
