import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    // Environment info
    const envInfo = {
      hasWebhookSecret: !!process.env.APP_WEBHOOK_SECRET,
      webhookSecretLength: process.env.APP_WEBHOOK_SECRET?.length || 0,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
    }

    // Get project details if projectId is provided
    let projectDetails = null
    if (projectId) {
      const projectResult = await sql`
        SELECT * FROM projects WHERE id = ${Number.parseInt(projectId)}
      `
      projectDetails = projectResult[0] || null
    }

    // Get recent webhook logs
    const webhookLogsQuery = projectId
      ? sql`
          SELECT * FROM webhook_logs 
          WHERE project_id = ${Number.parseInt(projectId)}
          ORDER BY created_at DESC 
          LIMIT 20
        `
      : sql`
          SELECT * FROM webhook_logs 
          ORDER BY created_at DESC 
          LIMIT 20
        `

    const webhookLogs = await webhookLogsQuery

    // Get recent projects
    const recentProjects = await sql`
      SELECT 
        id, 
        name, 
        status, 
        created_at,
        COALESCE(array_length(generated_photos, 1), 0) as photo_count
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({
      envInfo,
      projectDetails,
      webhookLogs,
      recentProjects,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug astria flow error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch debug data",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
