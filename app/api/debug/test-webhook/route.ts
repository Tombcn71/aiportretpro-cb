import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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
        'test', 
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
