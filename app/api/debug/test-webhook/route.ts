import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log the test webhook
    await sql`
      INSERT INTO webhook_logs (
        project_id, 
        webhook_type, 
        method, 
        headers, 
        body, 
        query_params, 
        processed
      ) VALUES (
        999, 
        'test-webhook', 
        'POST', 
        ${JSON.stringify(Object.fromEntries(request.headers.entries()))}, 
        ${JSON.stringify(body)}, 
        ${JSON.stringify(Object.fromEntries(request.nextUrl.searchParams.entries()))}, 
        true
      )
    `

    return NextResponse.json({
      success: true,
      message: "Test webhook received",
      timestamp: new Date().toISOString(),
      receivedBody: JSON.stringify(body),
    })
  } catch (error) {
    console.error("Test webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
