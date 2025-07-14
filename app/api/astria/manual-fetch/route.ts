import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    console.log(`🔍 Manual fetch for project ${projectId}`)

    // Get project from database
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${Number.parseInt(projectId)}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.name} (tune_id: ${project.prediction_id})`)

    if (!project.prediction_id) {
      return NextResponse.json({ error: "No Astria tune ID found for this project" }, { status: 400 })
    }

    // Check tune status first
    console.log(`🔍 Checking tune status for ${project.prediction_id}`)
    const tuneResponse = await fetch(`https://api.astria.ai/tunes/${project.prediction_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
    })

    if (!tuneResponse.ok) {
      console.error(`❌ Failed to get tune status: ${tuneResponse.status}`)
      return NextResponse.json(
        {
          error: `Failed to get tune status: ${tuneResponse.status}`,
          details: `Tune ${project.prediction_id} may not exist or API error`,
        },
        { status: 500 },
      )
    }

    const tuneData = await tuneResponse.json()
    console.log(`🎯 Tune status: ${tuneData.status}`)

    // Fetch prompts/images
    console.log(`📸 Fetching prompts for tune ${project.prediction_id}`)
    const promptsResponse = await fetch(`https://api.astria.ai/tunes/${project.prediction_id}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
    })

    if (!promptsResponse.ok) {
      console.error(`❌ Failed to get prompts: ${promptsResponse.status}`)
      return NextResponse.json(
        {
          error: `Failed to get prompts: ${promptsResponse.status}`,
          tuneStatus: tuneData.status,
          tuneData: tuneData,
        },
        { status: 500 },
      )
    }

    const promptsData = await promptsResponse.json()
    console.log(`📋 Found ${promptsData.length} prompts`)

    // Collect all image URLs
    const allImageUrls: string[] = []
    const promptDetails = []

    for (const prompt of promptsData) {
      const promptInfo = {
        id: prompt.id,
        status: prompt.status,
        imageCount: prompt.images ? prompt.images.length : 0,
      }
      promptDetails.push(promptInfo)

      if (prompt.images && Array.isArray(prompt.images)) {
        for (const image of prompt.images) {
          if (image.url && typeof image.url === "string") {
            allImageUrls.push(image.url)
          }
        }
      }
    }

    console.log(`🖼️ Total images found: ${allImageUrls.length}`)

    // Update database if we found images
    if (allImageUrls.length > 0) {
      await sql`
        UPDATE projects 
        SET 
          generated_photos = ${JSON.stringify(allImageUrls)},
          status = 'completed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${project.id}
      `
      console.log(`✅ Updated project ${project.id} with ${allImageUrls.length} photos`)
    } else {
      // Update status based on tune status
      const newStatus = tuneData.status === "succeeded" ? "completed" : tuneData.status
      await sql`
        UPDATE projects 
        SET 
          status = ${newStatus},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${project.id}
      `
      console.log(`📝 Updated project ${project.id} status to ${newStatus}`)
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        tuneId: project.prediction_id,
      },
      tuneStatus: tuneData.status,
      promptsFound: promptsData.length,
      imagesFound: allImageUrls.length,
      promptDetails: promptDetails,
      sampleImages: allImageUrls.slice(0, 3),
      message:
        allImageUrls.length > 0
          ? `Successfully recovered ${allImageUrls.length} photos!`
          : `No photos found yet. Tune status: ${tuneData.status}`,
    })
  } catch (error) {
    console.error("❌ Manual fetch error:", error)
    return NextResponse.json(
      {
        error: "Manual fetch failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
