import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check project 39 specifically
    const project39 = await sql`
      SELECT 
        id,
        name,
        status,
        generated_photos,
        CASE 
          WHEN generated_photos IS NOT NULL AND generated_photos != '[]' 
          THEN json_array_length(generated_photos::json)
          ELSE 0
        END as photo_count
      FROM projects 
      WHERE id = 39
    `

    // Check all recent projects
    const recentProjects = await sql`
      SELECT 
        id,
        name,
        status,
        created_at,
        CASE 
          WHEN generated_photos IS NULL THEN 'NULL'
          WHEN generated_photos = '[]' THEN 'EMPTY'
          ELSE 'HAS_PHOTOS'
        END as photo_status,
        CASE 
          WHEN generated_photos IS NOT NULL AND generated_photos != '[]' 
          THEN json_array_length(generated_photos::json)
          ELSE 0
        END as photo_count
      FROM projects 
      ORDER BY id DESC 
      LIMIT 10
    `

    // Check webhook logs for project 39
    const webhookLogs = await sql`
      SELECT 
        project_id,
        webhook_type,
        processed,
        created_at,
        request_body,
        error_message
      FROM webhook_logs 
      WHERE project_id = 39
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({
      project39: project39[0] || null,
      recentProjects,
      webhookLogs,
      summary: {
        project39HasPhotos: project39[0]?.photo_count > 0,
        project39PhotoCount: project39[0]?.photo_count || 0,
        totalRecentProjects: recentProjects.length,
        projectsWithPhotos: recentProjects.filter((p) => p.photo_count > 0).length,
      },
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      {
        error: "Database check failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
