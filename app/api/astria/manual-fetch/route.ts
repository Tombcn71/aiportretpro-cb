import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    console.log(`🔄 Manual fetch requested for project ${projectId}`)

    // Get project details
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

    console.log(`📁 Fetching photos for project: ${project.name} (tune_id: ${project.tune_id})`)

    // Fetch from Astria API
    const astriaApiKey = process.env.ASTRIA_API_KEY
    if (!astriaApiKey) {
      return NextResponse.json({ error: "Astria API key not configured" }, { status: 500 })
    }

    // Get all prompts for this tune
    const response = await fetch(`https://api.astria.ai/tunes/${project.tune_id}/prompts`, {
      headers: {
        Authorization: `Bearer ${astriaApiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Astria API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        { error: `Astria API error: ${response.status}`, details: errorText },
        { status: response.status },
      )
    }

    const prompts = await response.json()
    console.log(`📸 Found ${prompts.length} prompts for tune ${project.tune_id}`)

    // Extract all images from all prompts
    const allImages: string[] = []
    let promptCount = 0
    let imageCount = 0

    for (const prompt of prompts) {
      if (prompt.images && Array.isArray(prompt.images)) {
        promptCount++
        for (const imageUrl of prompt.images) {
          if (typeof imageUrl === "string" && imageUrl.startsWith("http")) {
            allImages.push(imageUrl)
            imageCount++
          }
        }
      }
    }

    console.log(`🎯 Extracted ${imageCount} images from ${promptCount} prompts`)

    if (allImages.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No images found in Astria API",
        promptCount,
        imageCount: 0,
      })
    }

    // Get existing photos
    let existingPhotos: string[] = []
    if (project.generated_photos) {
      try {
        existingPhotos =
          typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
      } catch (e) {
        console.warn("Could not parse existing photos, starting fresh")
        existingPhotos = []
      }
    }

    // Combine with existing photos
    const combinedPhotos = [...existingPhotos]
    let addedCount = 0

    for (const newUrl of allImages) {
      if (!combinedPhotos.includes(newUrl)) {
        combinedPhotos.push(newUrl)
        addedCount++
      }
    }

    // Update database
    await sql`
      UPDATE projects 
      SET 
        generated_photos = ${JSON.stringify(combinedPhotos)},
        status = CASE 
          WHEN ${combinedPhotos.length} >= 28 THEN 'completed'
          ELSE 'processing'
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `

    console.log(`✅ Updated project ${projectId}: Added ${addedCount} new photos. Total: ${combinedPhotos.length}`)

    return NextResponse.json({
      success: true,
      message: `Successfully fetched ${addedCount} new photos`,
      promptCount,
      imageCount,
      addedCount,
      totalPhotos: combinedPhotos.length,
    })
  } catch (error) {
    console.error("Manual fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch photos", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
