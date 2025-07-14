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
    console.log(`📁 Found project: ${project.name} (tune_id: ${project.tune_id})`)

    if (!project.tune_id) {
      return NextResponse.json({ error: "No tune_id found for this project" }, { status: 400 })
    }

    // Fetch from Astria API
    const astriaResponse = await fetch(`https://api.astria.ai/tunes/${project.tune_id}`, {
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
        },
        { status: 500 },
      )
    }

    const astriaData = await astriaResponse.json()
    console.log(`📊 Astria data:`, JSON.stringify(astriaData, null, 2))

    // Check if tune is trained and get prompts
    if (astriaData.status !== "trained") {
      return NextResponse.json({
        success: false,
        message: `Tune status is: ${astriaData.status}. Need 'trained' status to fetch photos.`,
        tuneStatus: astriaData.status,
        tuneData: astriaData,
      })
    }

    // Fetch prompts for this tune
    const promptsResponse = await fetch(`https://api.astria.ai/tunes/${project.tune_id}/prompts`, {
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
        },
        { status: 500 },
      )
    }

    const promptsData = await promptsResponse.json()
    console.log(`📸 Found ${promptsData.length} prompts`)

    // Collect all images from all prompts
    let allImages: string[] = []
    let completedPrompts = 0

    for (const prompt of promptsData) {
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
      // Update database
      await sql`
        UPDATE projects 
        SET 
          generated_photos = ${JSON.stringify(allImages)},
          status = ${allImages.length >= 40 ? "completed" : "processing"},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      console.log(`✅ Updated project ${projectId} with ${allImages.length} photos`)

      return NextResponse.json({
        success: true,
        message: `Successfully fetched ${allImages.length} photos!`,
        photosFound: allImages.length,
        completedPrompts,
        totalPrompts: promptsData.length,
        tuneStatus: astriaData.status,
        photos: allImages,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "No completed photos found yet",
        completedPrompts,
        totalPrompts: promptsData.length,
        tuneStatus: astriaData.status,
        promptsData: promptsData.map((p) => ({
          id: p.id,
          status: p.status,
          imageCount: p.images ? p.images.length : 0,
        })),
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
