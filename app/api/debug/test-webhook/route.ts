import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log("🧪 TEST WEBHOOK CALLED:", {
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: body,
      timestamp: new Date().toISOString(),
    })

    // Log to database if table exists
    try {
      await sql`
        INSERT INTO webhook_logs (webhook_type, project_id, raw_body, status)
        VALUES ('test', NULL, ${body}, 'test_received')
      `
    } catch (error) {
      console.log("Could not log to database (table might not exist):", error.message)
    }

    return NextResponse.json({
      success: true,
      message: "Test webhook received",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Test webhook endpoint is working",
    timestamp: new Date().toISOString(),
  })
}
