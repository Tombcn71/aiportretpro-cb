import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Get project
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]

    if (project.tune_id) {
      return NextResponse.json(
        {
          error: `Project already has tune_id: ${project.tune_id}`,
          tune_id: project.tune_id,
        },
        { status: 400 },
      )
    }

    // Try to find tune_id from prediction_id or other sources
    let tuneId = null

    // Check if prediction_id can be used as tune_id
    if (project.prediction_id) {
      tuneId = project.prediction_id
    }

    if (!tuneId) {
      return NextResponse.json(
        {
          error: "Could not determine tune_id for this project",
          project_data: {
            id: project.id,
            prediction_id: project.prediction_id,
            status: project.status,
          },
        },
        { status: 400 },
      )
    }

    // Update project with tune_id
    await sql`
      UPDATE projects 
      SET tune_id = ${tuneId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `

    return NextResponse.json({
      success: true,
      projectId,
      tune_id: tuneId,
      message: `Updated project ${projectId} with tune_id: ${tuneId}`,
    })
  } catch (error) {
    console.error("Fix tune_id error:", error)
    return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
