import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 })
    }

    // Get project
    const projects = await sql`SELECT * FROM projects WHERE id = ${projectId}`
    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Manual fetch for project: ${project.id} - ${project.name}`)

    if (!project.tune_id) {
      return NextResponse.json({ error: "No tune_id found for project" }, { status: 400 })
    }

    // Fetch from Astria API
    const astriaResponse = await fetch(`https://api.astria.ai/tunes/${project.tune_id}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!astriaResponse.ok) {
      console.error("Astria API error:", astriaResponse.status, astriaResponse.statusText)
      return NextResponse.json({ error: "Failed to fetch from Astria" }, { status: 500 })
    }

    const astriaData = await astriaResponse.json()
    console.log("📦 Astria response:", JSON.stringify(astriaData, null, 2))

    // Extract all images from all prompts - based on your example structure
    let allImages: string[] = []

    if (Array.isArray(astriaData)) {
      // If it's an array of prompts
      for (const prompt of astriaData) {
        if (prompt.images && Array.isArray(prompt.images)) {
          allImages = [...allImages, ...prompt.images]
        }
      }
    } else if (astriaData.images && Array.isArray(astriaData.images)) {
      // If it's a single prompt with images
      allImages = astriaData.images
    }

    console.log(`🖼️ Found ${allImages.length} total images from Astria`)

    if (allImages.length === 0) {
      return NextResponse.json({
        message: "No images found in Astria response",
        astriaData,
      })
    }

    // Get existing photos
    let existingPhotos: string[] = []
    if (project.generated_photos) {
      try {
        existingPhotos =
          typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
      } catch (e) {
        existingPhotos = []
      }
    }

    // Add new images
    const allPhotos = [...existingPhotos]
    let addedCount = 0

    for (const imageUrl of allImages) {
      if (typeof imageUrl === "string" && imageUrl.startsWith("http") && !allPhotos.includes(imageUrl)) {
        allPhotos.push(imageUrl)
        addedCount++
        console.log(`✅ Added: ${imageUrl}`)
      }
    }

    // Update database
    if (addedCount > 0) {
      await sql`
        UPDATE projects 
        SET 
          generated_photos = ${JSON.stringify(allPhotos)},
          status = CASE 
            WHEN ${allPhotos.length} >= 28 THEN 'completed'
            ELSE 'processing'
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      console.log(`✅ Manual fetch SUCCESS: Added ${addedCount} photos. Total: ${allPhotos.length}`)
    }

    return NextResponse.json({
      message: "success",
      totalImagesFromAstria: allImages.length,
      newImagesAdded: addedCount,
      totalImagesInProject: allPhotos.length,
      existingPhotos: existingPhotos.length,
    })
  } catch (error) {
    console.error("❌ Manual fetch error:", error)
    return NextResponse.json(
      {
        error: "Manual fetch failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
