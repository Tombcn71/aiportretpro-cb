import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Haal alle webhook logs op, inclusief oude
    const logs = await sql`
      SELECT * FROM webhook_logs 
      ORDER BY created_at DESC 
      LIMIT 50
    `

    return NextResponse.json({
      logs: logs,
      count: logs.length,
    })
  } catch (error) {
    console.error("Error fetching webhook logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs", details: error.message }, { status: 500 })
  }
}
