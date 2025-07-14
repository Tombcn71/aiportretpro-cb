import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get("projectId")

    // Get environment info
    const envInfo = {
      webhookSecret: process.env.APP_WEBHOOK_SECRET ? "present" : "missing",
      nextAuthUrl: process.env.NEXTAUTH_URL || "missing",
      astriaApiKey: process.env.ASTRIA_API_KEY ? "present" : "missing",
    }

    // Get project info if projectId provided
    let projectInfo = null
    if (projectId) {
      const project = await sql`
        SELECT id, name, status, created_at, updated_at, generated_photos
        FROM projects 
        WHERE id = ${Number.parseInt(projectId)}
      `
      projectInfo = project[0] || null
    }

    // Get recent webhook logs
    let webhookLogs = []
    try {
      if (projectId) {
        webhookLogs = await sql`
          SELECT * FROM webhook_logs 
          WHERE project_id = ${Number.parseInt(projectId)}
          ORDER BY created_at DESC 
          LIMIT 10
        `
      } else {
        webhookLogs = await sql`
          SELECT * FROM webhook_logs 
          ORDER BY created_at DESC 
          LIMIT 20
        `
      }
    } catch (error) {
      console.log("Webhook logs table might not exist:", error.message)
    }

    // Get recent projects
    const recentProjects = await sql`
      SELECT id, name, status, created_at, 
             CASE 
               WHEN generated_photos IS NULL THEN 0
               ELSE array_length(generated_photos, 1)
             END as photo_count
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({
      envInfo,
      projectInfo,
      webhookLogs,
      recentProjects,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug astria flow error:", error)
    return NextResponse.json({ error: "Debug failed", details: error.message }, { status: 500 })
  }
}
