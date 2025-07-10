import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import axios from "axios"

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId

    // Get project from database
    const project = await sql`
      SELECT * FROM projects WHERE id = ${Number.parseInt(projectId)}
    `

    if (!project[0]) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const projectData = project[0]

    // Check Astria status if we have a prediction_id
    let astriaStatus = null
    if (projectData.prediction_id && process.env.ASTRIA_API_KEY) {
      try {
        const response = await axios.get(`https://api.astria.ai/tunes/${projectData.prediction_id}`, {
          headers: {
            Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
          },
        })
        astriaStatus = response.data
      } catch (error) {
        console.error("Error checking Astria status:", error)
      }
    }

    return NextResponse.json({
      project: {
        id: projectData.id,
        name: projectData.name,
        status: projectData.status,
        prediction_id: projectData.prediction_id,
        photo_count: projectData.generated_photos?.length || 0,
        created_at: projectData.created_at,
        updated_at: projectData.updated_at,
      },
      astria_status: astriaStatus,
      debug_info: {
        has_prediction_id: !!projectData.prediction_id,
        has_photos: !!(projectData.generated_photos && projectData.generated_photos.length > 0),
        first_photo_preview: projectData.generated_photos?.[0]?.substring(0, 100) || null,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
