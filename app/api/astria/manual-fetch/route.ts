import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    console.log(`🔍 Manual fetch for project ${projectId}`)

    // Get project from database
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]

    // Check both tune_id and prediction_id (legacy)
    const tuneId = project.tune_id || project.prediction_id

    console.log(`📁 Found project: ${project.name}`)
    console.log(`🎯 Tune ID: ${tuneId} (from ${project.tune_id ? "tune_id" : "prediction_id"})`)

    if (!tuneId) {
      return NextResponse.json(
        {
          error: "No tune_id or prediction_id found for this project",
          project: {
            id: project.id,
            name: project.name,
            tune_id: project.tune_id,
            prediction_id: project.prediction_id,
            status: project.status,
          },
        },
        { status: 400 },
      )
    }

    // Fetch from Astria API
    console.log(`📡 Fetching tune status from Astria API...`)
    const astriaResponse = await fetch(`https://api.astria.ai/tunes/${tuneId}`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!astriaResponse.ok) {
      const errorText = await astriaResponse.text()
      console.error(`❌ Astria API error: ${astriaResponse.status} - ${errorText}`)
      return NextResponse.json(
        {
          error: `Astria API error: ${astriaResponse.status}`,
          details: errorText,
          tuneId: tuneId,
        },
        { status: 500 },
      )
    }

    const astriaData = await astriaResponse.json()
    console.log(`📊 Astria tune status: ${astriaData.status}`)

    // Fetch prompts for this tune
    console.log(`📸 Fetching prompts...`)
    const promptsResponse = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!promptsResponse.ok) {
      const errorText = await promptsResponse.text()
      console.error(`❌ Prompts API error: ${promptsResponse.status} - ${errorText}`)
      return NextResponse.json(
        {
          error: `Prompts API error: ${promptsResponse.status}`,
          details: errorText,
          tuneStatus: astriaData.status,
        },
        { status: 500 },
      )
    }

    const promptsData = await promptsResponse.json()
    console.log(`📋 Found ${promptsData.length} prompts`)

    // Collect all images from all prompts
    let allImages: string[] = []
    let completedPrompts = 0
    const promptDetails = []

    for (const prompt of promptsData) {
      const promptInfo = {
        id: prompt.id,
        status: prompt.status,
        imageCount: prompt.images ? prompt.images.length : 0,
      }
      promptDetails.push(promptInfo)

      if (prompt.status === "succeeded" && prompt.images && Array.isArray(prompt.images)) {
        completedPrompts++
        const imageUrls = prompt.images
          .filter((img: any) => img.url && typeof img.url === "string")
          .map((img: any) => img.url)

        allImages = [...allImages, ...imageUrls]
        console.log(`✅ Prompt ${prompt.id}: ${imageUrls.length} images`)
      } else {
        console.log(`⏳ Prompt ${prompt.id}: status ${prompt.status}`)
      }
    }

    console.log(`📊 Total images found: ${allImages.length}`)

    if (allImages.length > 0) {
      // Update database with photos
      await sql`
        UPDATE projects 
        SET 
          generated_photos = ${JSON.stringify(allImages)},
          status = 'completed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      console.log(`✅ Updated project ${projectId} with ${allImages.length} photos`)

      return NextResponse.json({
        success: true,
        message: `Successfully fetched ${allImages.length} photos!`,
        project: {
          id: project.id,
          name: project.name,
          tuneId: tuneId,
        },
        photosFound: allImages.length,
        completedPrompts,
        totalPrompts: promptsData.length,
        tuneStatus: astriaData.status,
        promptDetails,
        samplePhotos: allImages.slice(0, 3), // First 3 for preview
      })
    } else {
      // Update status but no photos yet
      const newStatus = astriaData.status === "trained" ? "processing" : astriaData.status
      await sql`
        UPDATE projects 
        SET 
          status = ${newStatus},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      return NextResponse.json({
        success: false,
        message: `No photos found yet. Tune status: ${astriaData.status}`,
        project: {
          id: project.id,
          name: project.name,
          tuneId: tuneId,
        },
        photosFound: 0,
        completedPrompts,
        totalPrompts: promptsData.length,
        tuneStatus: astriaData.status,
        promptDetails,
        explanation:
          astriaData.status === "trained"
            ? "Tune is trained but no completed prompts yet. Photos may still be generating."
            : `Tune status is '${astriaData.status}'. Need 'trained' status for photos.`,
      })
    }
  } catch (error) {
    console.error("❌ Manual fetch error:", error)
    return NextResponse.json(
      {
        error: "Manual fetch failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
