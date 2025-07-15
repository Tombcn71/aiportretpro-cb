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

    if (!project.tune_id) {
      return NextResponse.json({ error: "Project has no tune_id" }, { status: 400 })
    }

    console.log(`🔍 Fetching images for project ${project.id} with tune_id: ${project.tune_id}`)

    // Fetch from Astria API
    const astriaResponse = await fetch(`https://api.astria.ai/tunes/${project.tune_id}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!astriaResponse.ok) {
      const errorText = await astriaResponse.text()
      console.error("Astria API error:", errorText)
      return NextResponse.json(
        { error: "Failed to fetch from Astria API", details: errorText },
        { status: astriaResponse.status },
      )
    }

    const astriaData = await astriaResponse.json()
    console.log("Astria API response:", JSON.stringify(astriaData, null, 2))

    // Extract all images from all prompts
    const allImages: string[] = []

    if (Array.isArray(astriaData)) {
      for (const prompt of astriaData) {
        if (prompt.images && Array.isArray(prompt.images)) {
          for (const img of prompt.images) {
            if (typeof img === "string") {
              allImages.push(img)
            } else if (img && img.url) {
              allImages.push(img.url)
            }
          }
        }
      }
    }

    console.log(`🎯 Found ${allImages.length} images total`)

    // Get existing photos
    let existingPhotos: string[] = []
    if (project.generated_photos) {
      try {
        existingPhotos =
          typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
      } catch (e) {
        console.warn("Could not parse existing photos")
        existingPhotos = []
      }
    }

    // Add new images
    const combinedPhotos = [...existingPhotos]
    let addedCount = 0

    for (const imageUrl of allImages) {
      if (!combinedPhotos.includes(imageUrl)) {
        combinedPhotos.push(imageUrl)
        addedCount++
      }
    }

    // Update database
    if (addedCount > 0) {
      await sql`
        UPDATE projects 
        SET 
          generated_photos = ${JSON.stringify(combinedPhotos)},
          status = CASE 
            WHEN ${combinedPhotos.length} >= 40 THEN 'completed'
            ELSE 'processing'
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      console.log(`✅ Added ${addedCount} new photos. Total: ${combinedPhotos.length}`)
    }

    return NextResponse.json({
      success: true,
      projectId,
      tune_id: project.tune_id,
      totalImages: allImages.length,
      newImages: addedCount,
      totalPhotos: combinedPhotos.length,
      astriaResponse: astriaData,
    })
  } catch (error) {
    console.error("Manual fetch error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
