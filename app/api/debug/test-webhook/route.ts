import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    console.log("🧪 Test webhook called:", {
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: body,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Test webhook received",
      timestamp: new Date().toISOString(),
      receivedBody: body,
    })
  } catch (error) {
    console.error("Test webhook error:", error)
    return NextResponse.json({ error: "Test webhook failed", details: error.message }, { status: 500 })
  }
}
