import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const projectId = searchParams.get("projectId")

    // Get recent webhook logs
    const webhookLogs = await sql`
      SELECT * FROM webhook_logs 
      ${projectId ? sql`WHERE project_id = ${projectId}` : sql``}
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get project details if projectId is provided
    let projectDetails = null
    if (projectId) {
      const projects = await sql`
        SELECT * FROM projects WHERE id = ${projectId}
      `
      projectDetails = projects[0] || null
    }

    // Get environment info
    const envInfo = {
      hasWebhookSecret: !!process.env.APP_WEBHOOK_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      webhookSecretLength: process.env.APP_WEBHOOK_SECRET?.length || 0,
      nextAuthUrl: process.env.NEXTAUTH_URL?.replace(/\/+$/, "") || "not-set",
    }

    return NextResponse.json({
      webhookLogs,
      projectDetails,
      envInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug astria flow error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
