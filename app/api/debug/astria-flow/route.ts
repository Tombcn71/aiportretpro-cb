import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

async function testAstriaConnection() {
  try {
    const response = await fetch("https://api.astria.ai/tunes", {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
    })
    return { success: response.ok, status: response.status }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const projectId = url.searchParams.get("projectId")

  try {
    // Test Astria connection
    const astriaTest = await testAstriaConnection()

    // Check environment variables (only the ones we need for debugging)
    const envCheck = {
      ASTRIA_API_KEY: !!process.env.ASTRIA_API_KEY,
      APP_WEBHOOK_SECRET: !!process.env.APP_WEBHOOK_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
    }

    // Get recent webhook logs
    const webhookLogs = await sql`
      SELECT * FROM webhook_logs 
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get project info if projectId provided
    let projectInfo = null
    if (projectId) {
      const project = await sql`
        SELECT id, name, status, gender, created_at, updated_at, 
               generated_photos, prediction_id
        FROM projects WHERE id = ${Number.parseInt(projectId)}
      `
      projectInfo = project[0] || null
    }

    // Get all projects with their status (only photo generation related fields)
    const allProjects = await sql`
      SELECT id, name, status, created_at, 
             COALESCE(array_length(generated_photos, 1), 0) as photo_count
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      astria_connection: astriaTest,
      environment: envCheck,
      webhook_logs: webhookLogs,
      project_info: projectInfo,
      recent_projects: allProjects,
      webhook_url: `${process.env.NEXTAUTH_URL}/api/astria/prompt-webhook`,
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json({ error: "Debug failed", details: error.message }, { status: 500 })
  }
}
