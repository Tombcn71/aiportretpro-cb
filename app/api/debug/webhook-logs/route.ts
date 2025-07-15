import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get recent webhook logs
    const logs = await sql`
      SELECT * FROM webhook_logs 
      ORDER BY created_at DESC 
      LIMIT 50
    `

    return NextResponse.json({
      success: true,
      logs: logs,
      count: logs.length,
    })
  } catch (error) {
    console.error("Error fetching webhook logs:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        logs: [],
      },
      { status: 500 },
    )
  }
}
