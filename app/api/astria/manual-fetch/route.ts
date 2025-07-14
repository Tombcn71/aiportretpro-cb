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
    console.log(`📊 Current status: ${project.status}`)
    console.log(`📸 Current photos: ${project.generated_photos ? JSON.parse(project.generated_photos).length : 0}`)

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

    // Fetch tune status from Astria API
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
          message: "Could not connect to Astria API. Check if tune exists.",
        },
        { status: 500 },
      )
    }

    const astriaData = await astriaResponse.json()
    console.log(`📊 Astria tune status: ${astriaData.status}`)
    console.log(`🔍 Astria tune data:`, JSON.stringify(astriaData, null, 2))

    // Fetch prompts for this tune
    console.log(`📸 Fetching prompts from Astria...`)
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
          message: "Could not fetch prompts from Astria API.",
        },
        { status: 500 },
      )
    }

    const promptsData = await promptsResponse.json()
    console.log(`📋 Found ${promptsData.length} prompts`)

    // Collect all images from all prompts
    const allImages: string[] = []
    let completedPrompts = 0
    const promptDetails = []

    for (const prompt of promptsData) {
      const promptInfo = {
        id: prompt.id,
        status: prompt.status,
        imageCount: prompt.images ? prompt.images.length : 0,
        images: prompt.images || [],
      }
      promptDetails.push(promptInfo)

      console.log(`🔍 Prompt ${prompt.id}: status=${prompt.status}, images=${promptInfo.imageCount}`)

      if (prompt.images && Array.isArray(prompt.images)) {
        for (const image of prompt.images) {
          if (image.url && typeof image.url === "string") {
            allImages.push(image.url)
            console.log(`✅ Added image: ${image.url}`)
          }
        }
        if (prompt.status === "succeeded") {
          completedPrompts++
        }
      }
    }

    console.log(`📊 Total images collected: ${allImages.length}`)
    console.log(`📊 Completed prompts: ${completedPrompts}/${promptsData.length}`)

    // Always update database with whatever we found
    if (allImages.length > 0) {
      // Save photos to database
      await sql`
        UPDATE projects 
        SET 
          generated_photos = ${JSON.stringify(allImages)},
          status = 'completed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      console.log(`✅ SAVED ${allImages.length} photos to database for project ${projectId}`)

      return NextResponse.json({
        success: true,
        message: `🎉 SUCCESS! Saved ${allImages.length} photos to database!`,
        project: {
          id: project.id,
          name: project.name,
          tuneId: tuneId,
        },
        photosFound: allImages.length,
        photosSaved: allImages.length,
        completedPrompts,
        totalPrompts: promptsData.length,
        tuneStatus: astriaData.status,
        promptDetails,
        samplePhotos: allImages.slice(0, 5), // First 5 for preview
        allPhotos: allImages, // All photos for verification
        databaseUpdate: "Photos saved to generated_photos column",
      })
    } else {
      // Update status but no photos found
      await sql`
        UPDATE projects 
        SET 
          status = ${astriaData.status || "no_photos"},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      return NextResponse.json({
        success: false,
        message: `No photos found in Astria API for tune ${tuneId}`,
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
        explanation: "No images found in any prompts. Check if generation completed successfully.",
        rawPromptsData: promptsData, // For debugging
      })
    }
  } catch (error) {
    console.error("❌ Manual fetch error:", error)
    return NextResponse.json(
      {
        error: "Manual fetch failed",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
