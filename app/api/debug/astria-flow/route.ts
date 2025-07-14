import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const projectId = url.searchParams.get("projectId")

    // Check environment variables
    const environment = {
      ASTRIA_API_KEY: !!process.env.ASTRIA_API_KEY,
      APP_WEBHOOK_SECRET: !!process.env.APP_WEBHOOK_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
    }

    // Test Astria connection
    const astriaConnection = { success: false, error: null }
    try {
      const response = await fetch("https://api.astria.ai/tunes", {
        headers: {
          Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        },
      })
      astriaConnection.success = response.ok
      if (!response.ok) {
        astriaConnection.error = await response.text()
      }
    } catch (error) {
      astriaConnection.error = error.message
    }

    // Get webhook URL
    const baseUrl = process.env.NEXTAUTH_URL || "https://www.aiportretpro.nl"
    const webhookUrl = `${baseUrl}/api/astria/prompt-webhook`

    // Get webhook logs
    let webhookLogs = []
    try {
      if (projectId) {
        webhookLogs = await sql`
          SELECT * FROM webhook_logs 
          WHERE project_id = ${Number.parseInt(projectId)}
          ORDER BY created_at DESC 
          LIMIT 20
        `
      } else {
        webhookLogs = await sql`
          SELECT * FROM webhook_logs 
          ORDER BY created_at DESC 
          LIMIT 20
        `
      }
    } catch (error) {
      console.error("Error fetching webhook logs:", error)
      // Table might not exist yet
    }

    // Get project info if projectId provided
    let projectInfo = null
    if (projectId) {
      try {
        const projects = await sql`
          SELECT * FROM projects WHERE id = ${Number.parseInt(projectId)}
        `
        projectInfo = projects[0] || null
      } catch (error) {
        console.error("Error fetching project:", error)
      }
    }

    // Get recent projects
    let recentProjects = []
    try {
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
    } catch (error) {
      console.error("Error fetching recent projects:", error)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment,
      astria_connection: astriaConnection,
      webhook_url: webhookUrl,
      webhook_logs: webhookLogs,
      project_info: projectInfo,
      recent_projects: recentProjects,
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
