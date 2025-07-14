import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get all projects with their photo counts
    const projects = await sql`
      SELECT 
        id,
        name,
        status,
        generated_photos,
        created_at,
        updated_at,
        COALESCE(array_length(generated_photos, 1), 0) as photo_count
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get recent webhook logs specifically for photos
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
      WHERE webhook_type = 'prompt'
      ORDER BY created_at DESC 
      LIMIT 50
    `

    // Check which projects have photos vs which don't
    const projectsWithPhotos = projects.filter((p) => p.photo_count > 0)
    const projectsWithoutPhotos = projects.filter((p) => p.photo_count === 0)

    // Get sample photos from projects that have them
    const samplePhotos = projectsWithPhotos.slice(0, 3).map((project) => ({
      projectId: project.id,
      projectName: project.name,
      photoCount: project.photo_count,
      firstFewPhotos: project.generated_photos?.slice(0, 3) || [],
    }))

    return NextResponse.json({
      summary: {
        totalProjects: projects.length,
        projectsWithPhotos: projectsWithPhotos.length,
        projectsWithoutPhotos: projectsWithoutPhotos.length,
        totalWebhookLogs: webhookLogs.length,
      },
      projectsWithPhotos: projectsWithPhotos.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        photoCount: p.photo_count,
        created: p.created_at,
        updated: p.updated_at,
      })),
      projectsWithoutPhotos: projectsWithoutPhotos.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        created: p.created_at,
      })),
      samplePhotos,
      recentWebhooks: webhookLogs.map((log) => ({
        id: log.id,
        projectId: log.project_id,
        status: log.status,
        hasImages: log.parsed_data?.images?.length > 0,
        imageCount: log.parsed_data?.images?.length || 0,
        created: log.created_at,
        error: log.error_message,
      })),
    })
  } catch (error) {
    console.error("Error checking photos:", error)
    return NextResponse.json({ error: "Failed to check photos", details: error.message }, { status: 500 })
  }
}
