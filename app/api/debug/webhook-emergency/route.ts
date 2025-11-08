import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("🚨 EMERGENCY WEBHOOK DEBUG")

    // Get recent webhook logs
    const webhookLogs = await sql`
      SELECT * FROM webhook_logs 
      WHERE type LIKE '%webhook%' 
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get projects without photos but with tune_id
    const projectsWithoutPhotos = await sql`
      SELECT id, name, tune_id, status, created_at, generated_photos
      FROM projects 
      WHERE tune_id IS NOT NULL 
      AND (generated_photos IS NULL OR generated_photos = '[]' OR generated_photos = '')
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get all recent projects
    const recentProjects = await sql`
      SELECT id, name, tune_id, status, created_at, 
             CASE 
               WHEN generated_photos IS NULL THEN 'null'
               WHEN generated_photos = '' THEN 'empty'
               WHEN generated_photos = '[]' THEN 'empty_array'
               ELSE 'has_data'
             END as photo_status
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 15
    `

    return NextResponse.json({
      success: true,
      data: {
        webhookLogs: webhookLogs.map((log) => ({
          id: log.id,
          type: log.type,
          created_at: log.created_at,
          payload: typeof log.payload === "string" ? JSON.parse(log.payload) : log.payload,
          error: log.error,
        })),
        projectsWithoutPhotos,
        recentProjects,
        summary: {
          totalWebhookLogs: webhookLogs.length,
          projectsWithoutPhotos: projectsWithoutPhotos.length,
          recentProjectsCount: recentProjects.length,
        },
      },
    })
  } catch (error) {
    console.error("Emergency debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
