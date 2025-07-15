import { NextResponse } from "next/server"

export async function POST() {
  try {
    const testPayload = {
      status: "success",
      message: "Webhook endpoint is working",
      timestamp: new Date().toISOString(),
    }

    // Send test webhook to our own endpoint
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/debug/webhook-test`

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      status: response.status,
      response: result,
      webhookUrl,
    })
  } catch (error) {
    console.error("Test webhook error:", error)
    return NextResponse.json({ error: "Failed to test webhook", details: error.message }, { status: 500 })
  }
}
