import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID required" }, { status: 400 })
    }

    // Get project details
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]

    // Check if project already has tune_id
    if (project.tune_id) {
      return NextResponse.json({
        success: false,
        error: `Project already has tune_id: ${project.tune_id}`,
      })
    }

    // Try to find tune_id from Astria API
    const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY
    const ASTRIA_API_URL = process.env.ASTRIA_API_URL || "https://api.astria.ai"

    if (!ASTRIA_API_KEY) {
      return NextResponse.json({ success: false, error: "Astria API key not configured" }, { status: 500 })
    }

    try {
      // Get recent tunes from Astria
      const response = await fetch(`${ASTRIA_API_URL}/tunes`, {
        headers: {
          Authorization: `Bearer ${ASTRIA_API_KEY}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Astria API error: ${response.status}`)
      }

      const data = await response.json()
      const tunes = data.data || data

      console.log(`Found ${tunes.length} tunes from Astria API`)

      // Try to match by project name or timing
      const projectCreatedAt = new Date(project.created_at)

      // Look for tunes created around the same time as the project
      const matchingTunes = tunes.filter((tune: any) => {
        const tuneCreatedAt = new Date(tune.created_at)
        const timeDiff = Math.abs(tuneCreatedAt.getTime() - projectCreatedAt.getTime())
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        // Match if created within 2 hours of each other
        return hoursDiff <= 2
      })

      if (matchingTunes.length === 0) {
        return NextResponse.json({
          success: false,
          error: "No matching tune found in Astria API",
          debug: {
            projectCreated: project.created_at,
            totalTunes: tunes.length,
            recentTunes: tunes.slice(0, 5).map((t: any) => ({
              id: t.id,
              created_at: t.created_at,
              title: t.title,
            })),
          },
        })
      }

      // Use the most recent matching tune
      const matchingTune = matchingTunes[0]

      // Update project with tune_id
      await sql`
        UPDATE projects 
        SET tune_id = ${matchingTune.id.toString()}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      console.log(`✅ Fixed tune_id for project ${projectId}: ${matchingTune.id}`)

      return NextResponse.json({
        success: true,
        tuneId: matchingTune.id,
        message: `Successfully assigned tune_id ${matchingTune.id} to project ${projectId}`,
      })
    } catch (astriaError) {
      console.error("Astria API error:", astriaError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch from Astria API: ${astriaError.message}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Fix tune_id error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
