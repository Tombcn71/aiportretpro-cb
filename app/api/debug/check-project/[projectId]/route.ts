import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const projectId = Number.parseInt(params.projectId)

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Get project details
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]

    // Get webhook logs for this project
    const webhookLogs = await sql`
      SELECT * FROM webhook_logs 
      WHERE payload::text LIKE '%${project.tune_id || projectId}%'
      ORDER BY created_at DESC 
      LIMIT 10
    `

    // Parse generated photos
    let photoCount = 0
    let photos: string[] = []
    if (project.generated_photos) {
      try {
        photos =
          typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
        photoCount = photos.length
      } catch (e) {
        console.warn("Could not parse photos")
      }
    }

    // Check Astria API status if tune_id exists
    let astriaStatus = null
    if (project.tune_id) {
      try {
        const astriaApiKey = process.env.ASTRIA_API_KEY
        if (astriaApiKey) {
          const response = await fetch(`https://api.astria.ai/tunes/${project.tune_id}`, {
            headers: {
              Authorization: `Bearer ${astriaApiKey}`,
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            const tuneData = await response.json()
            astriaStatus = {
              status: tuneData.status,
              title: tuneData.title,
              created_at: tuneData.created_at,
              updated_at: tuneData.updated_at,
            }
          }
        }
      } catch (error) {
        console.warn("Could not fetch Astria status:", error)
      }
    }

    return NextResponse.json({
      project: {
        ...project,
        photo_count: photoCount,
        photos: photos.slice(0, 5), // First 5 photos for preview
      },
      webhookLogs: webhookLogs.map((log) => ({
        id: log.id,
        type: log.type,
        created_at: log.created_at,
        error: log.error,
        payload: typeof log.payload === "string" ? JSON.parse(log.payload) : log.payload,
      })),
      astriaStatus,
    })
  } catch (error) {
    console.error("Check project error:", error)
    return NextResponse.json(
      { error: "Failed to check project", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
