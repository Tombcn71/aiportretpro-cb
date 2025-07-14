import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get("projectId")

    // Environment check
    const envInfo = {
      hasWebhookSecret: !!process.env.APP_WEBHOOK_SECRET,
      webhookSecretLength: process.env.APP_WEBHOOK_SECRET?.length || 0,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    }

    let projectDetails = null
    let webhookLogs = []
    let recentProjects = []

    if (projectId) {
      // Get specific project details
      const projectResult = await sql`
        SELECT id, name, status, model_id, generated_photos, created_at, updated_at
        FROM projects 
        WHERE id = ${Number.parseInt(projectId)}
      `

      if (projectResult.length > 0) {
        projectDetails = {
          ...projectResult[0],
          photo_count: projectResult[0].generated_photos?.length || 0,
        }
      }

      // Get webhook logs for this project
      webhookLogs = await sql`
        SELECT id, webhook_type, project_id, raw_body, parsed_data, status, error_message, created_at
        FROM webhook_logs 
        WHERE project_id = ${Number.parseInt(projectId)}
        ORDER BY created_at DESC 
        LIMIT 20
      `
    } else {
      // Get recent webhook logs
      webhookLogs = await sql`
        SELECT id, webhook_type, project_id, raw_body, parsed_data, status, error_message, created_at
        FROM webhook_logs 
        ORDER BY created_at DESC 
        LIMIT 10
      `

      // Get recent projects
      const projectsResult = await sql`
        SELECT id, name, status, generated_photos, created_at
        FROM projects 
        ORDER BY created_at DESC 
        LIMIT 10
      `

      recentProjects = projectsResult.map((project) => ({
        ...project,
        photo_count: project.generated_photos?.length || 0,
      }))
    }

    // Parse webhook logs for better display
    const parsedWebhookLogs = webhookLogs.map((log) => {
      let body = null
      try {
        if (log.raw_body) {
          body = JSON.parse(log.raw_body)
        } else if (log.parsed_data) {
          body = typeof log.parsed_data === "string" ? JSON.parse(log.parsed_data) : log.parsed_data
        }
      } catch (e) {
        // Keep body as null if parsing fails
      }

      return {
        ...log,
        body,
        processed: log.status?.includes("success") || log.status === "parsed",
      }
    })

    return NextResponse.json({
      envInfo,
      projectDetails,
      webhookLogs: parsedWebhookLogs,
      recentProjects: projectId ? null : recentProjects,
    })
  } catch (error) {
    console.error("Error in astria-flow debug:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch debug data",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
