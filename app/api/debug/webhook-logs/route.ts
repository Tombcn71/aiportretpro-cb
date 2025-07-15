import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get("projectId")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")

    let logs
    if (projectId) {
      logs = await sql`
        SELECT * FROM webhook_logs 
        WHERE project_id = ${Number.parseInt(projectId)}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    } else {
      logs = await sql`
        SELECT * FROM webhook_logs 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    return NextResponse.json({
      success: true,
      logs: logs.map((log) => ({
        id: log.id,
        type: log.type,
        payload: typeof log.payload === "string" ? JSON.parse(log.payload) : log.payload,
        error: log.error,
        created_at: log.created_at,
        project_id: log.project_id,
      })),
    })
  } catch (error) {
    console.error("Error fetching webhook logs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch webhook logs",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
