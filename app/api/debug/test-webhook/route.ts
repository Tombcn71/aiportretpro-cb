import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("🧪 Simple webhook test received:", body)

    // Log the test webhook to database
    try {
      await sql`
        INSERT INTO webhook_logs (
          project_id, 
          webhook_type, 
          method, 
          headers, 
          body, 
          query_params, 
          processed,
          status
        ) VALUES (
          999, 
          'test-webhook', 
          'POST', 
          ${JSON.stringify(Object.fromEntries(request.headers.entries()))}, 
          ${JSON.stringify(body)}, 
          ${JSON.stringify(Object.fromEntries(request.nextUrl.searchParams.entries()))}, 
          true,
          'success'
        )
      `
    } catch (dbError) {
      console.error("Failed to log test webhook to database:", dbError)
    }

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      body,
      message: "Simple webhook test successful",
    })
  } catch (error) {
    console.error("Error in simple webhook test:", error)

    // Log error to database
    try {
      await sql`
        INSERT INTO webhook_logs (
          project_id, 
          webhook_type, 
          method, 
          status,
          error_message,
          processed
        ) VALUES (
          999, 
          'test-webhook', 
          'POST', 
          'error',
          ${error.message},
          false
        )
      `
    } catch (dbError) {
      console.error("Failed to log error to database:", dbError)
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
