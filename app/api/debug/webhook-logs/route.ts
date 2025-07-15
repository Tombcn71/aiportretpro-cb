import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const logs = await sql`
      SELECT * FROM webhook_logs 
      ORDER BY created_at DESC 
      LIMIT 50
    `

    return NextResponse.json({
      success: true,
      logs: logs.map((log) => ({
        id: log.id,
        type: log.type,
        payload: typeof log.payload === "string" ? JSON.parse(log.payload) : log.payload,
        error: log.error,
        created_at: log.created_at,
      })),
    })
  } catch (error) {
    console.error("Error fetching webhook logs:", error)
    return NextResponse.json({ error: "Failed to fetch webhook logs" }, { status: 500 })
  }
}
