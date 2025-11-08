import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params

    // Get project details
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]

    // Parse generated photos
    let photos: string[] = []
    if (project.generated_photos) {
      try {
        photos =
          typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
      } catch (e) {
        photos = []
      }
    }

    // Get webhook logs for this project's tune_id
    let webhookLogs = []
    if (project.tune_id) {
      webhookLogs = await sql`
        SELECT * FROM webhook_logs 
        WHERE payload::text LIKE ${`%${project.tune_id}%`}
        ORDER BY created_at DESC 
        LIMIT 10
      `
    }

    // Check Astria API status if tune_id exists
    let astriaStatus = null
    if (project.tune_id) {
      try {
        const response = await fetch(`https://api.astria.ai/tunes/${project.tune_id}`, {
          headers: {
            Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          astriaStatus = await response.json()
        } else {
          astriaStatus = { error: `HTTP ${response.status}` }
        }
      } catch (error) {
        astriaStatus = { error: error.message }
      }
    }

    return NextResponse.json({
      project: {
        ...project,
        photoCount: photos.length,
        photos: photos.slice(0, 5), // First 5 photos for preview
        created_at: new Date(project.created_at).toLocaleString("nl-NL"),
        updated_at: new Date(project.updated_at).toLocaleString("nl-NL"),
      },
      webhookLogs: webhookLogs.map((log) => ({
        ...log,
        created_at: new Date(log.created_at).toLocaleString("nl-NL"),
      })),
      astriaStatus,
      webhookUrl: project.tune_id
        ? `https://www.aiportretpro.nl/api/astria/prompt-webhook?user_id=1&model_id=${project.tune_id}&webhook_secret=shadf892yr32548hq23h`
        : null,
    })
  } catch (error) {
    console.error("Check project error:", error)
    return NextResponse.json({ error: "Failed to check project", details: error.message }, { status: 500 })
  }
}
