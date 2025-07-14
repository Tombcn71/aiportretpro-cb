import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    // Environment check
    const envInfo = {
      hasWebhookSecret: !!process.env.APP_WEBHOOK_SECRET,
      webhookSecretLength: process.env.APP_WEBHOOK_SECRET?.length || 0,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasAstriaApiKey: !!process.env.ASTRIA_API_KEY,
    }

    let projectDetails = null
    let webhookLogs = []
    let recentProjects = []

    if (projectId) {
      // Get specific project details
      const projectResult = await sql`
        SELECT 
          id, 
          name, 
          status, 
          model_id, 
          generated_photos, 
          created_at,
          updated_at
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
        SELECT 
          id,
          project_id,
          webhook_type,
          method,
          body,
          status,
          error_message,
          processed,
          created_at
        FROM webhook_logs 
        WHERE project_id = ${Number.parseInt(projectId)}
        ORDER BY created_at DESC 
        LIMIT 20
      `
    } else {
      // Get recent projects
      recentProjects = await sql`
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

      // Get recent webhook logs
      webhookLogs = await sql`
        SELECT 
          id,
          project_id,
          webhook_type,
          method,
          body,
          status,
          error_message,
          processed,
          created_at
        FROM webhook_logs 
        ORDER BY created_at DESC 
        LIMIT 20
      `
    }

    return NextResponse.json({
      envInfo,
      projectDetails,
      webhookLogs,
      recentProjects: projectId ? null : recentProjects,
      timestamp: new Date().toISOString(),
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
