import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get environment info
    const envCheck = {
      webhookSecret: process.env.APP_WEBHOOK_SECRET ? "✅ Present" : "❌ Missing",
      nextAuthUrl: process.env.NEXTAUTH_URL || "❌ Missing",
      databaseUrl: process.env.DATABASE_URL ? "✅ Present" : "❌ Missing",
    }

    // Get recent webhook logs
    const webhookLogs = await sql`
      SELECT 
        id,
        webhook_type,
        project_id,
        raw_body,
        parsed_data,
        status,
        error_message,
        created_at
      FROM webhook_logs 
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get recent projects
    const projects = await sql`
      SELECT 
        id,
        name,
        status,
        generated_photos,
        created_at
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({
      environment: envCheck,
      webhookLogs: webhookLogs.map((log) => ({
        ...log,
        created_at: log.created_at.toISOString(),
        photoCount: log.parsed_data?.images?.length || 0,
      })),
      projects: projects.map((project) => ({
        ...project,
        created_at: project.created_at.toISOString(),
        photoCount: project.generated_photos?.length || 0,
      })),
    })
  } catch (error) {
    console.error("Debug astria flow error:", error)
    return NextResponse.json({ error: "Failed to get debug info", details: error.message }, { status: 500 })
  }
}
