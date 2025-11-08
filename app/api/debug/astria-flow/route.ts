import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get recent projects with tune_ids
    const projects = await sql`
      SELECT id, name, tune_id, status, generated_photos, created_at, updated_at
      FROM projects 
      WHERE tune_id IS NOT NULL
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get recent webhook logs
    const webhookLogs = await sql`
      SELECT id, type, payload, error, created_at
      FROM webhook_logs 
      ORDER BY created_at DESC 
      LIMIT 50
    `

    // Process projects to add photo counts
    const processedProjects = projects.map((project) => {
      let photoCount = 0
      if (project.generated_photos) {
        try {
          const photos =
            typeof project.generated_photos === "string"
              ? JSON.parse(project.generated_photos)
              : project.generated_photos
          photoCount = Array.isArray(photos) ? photos.length : 0
        } catch (e) {
          photoCount = 0
        }
      }

      return {
        ...project,
        photoCount,
        created_at: new Date(project.created_at).toLocaleString("nl-NL"),
        updated_at: new Date(project.updated_at).toLocaleString("nl-NL"),
      }
    })

    // Process webhook logs
    const processedWebhookLogs = webhookLogs.map((log) => {
      let payload = null
      try {
        payload = typeof log.payload === "string" ? JSON.parse(log.payload) : log.payload
      } catch (e) {
        payload = log.payload
      }

      return {
        ...log,
        payload,
        created_at: new Date(log.created_at).toLocaleString("nl-NL"),
      }
    })

    return NextResponse.json({
      projects: processedProjects,
      webhookLogs: processedWebhookLogs,
      webhookSecret: process.env.APP_WEBHOOK_SECRET ? "✅ Present" : "❌ Missing",
      nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
    })
  } catch (error) {
    console.error("Debug astria flow error:", error)
    return NextResponse.json({ error: "Failed to fetch debug data", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
