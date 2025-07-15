import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ success: false, error: "Project ID required" }, { status: 400 })
    }

    console.log(`🚑 Manual fetch requested for project ${projectId}`)

    // Get project details
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.name}, tune_id: ${project.tune_id}`)

    if (!project.tune_id) {
      return NextResponse.json({
        success: false,
        error: "Project has no tune_id. Cannot fetch photos.",
      })
    }

    const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY
    const ASTRIA_API_URL = process.env.ASTRIA_API_URL || "https://api.astria.ai"

    if (!ASTRIA_API_KEY) {
      return NextResponse.json({ success: false, error: "Astria API key not configured" }, { status: 500 })
    }

    try {
      // Fetch prompts for this tune
      console.log(`🔍 Fetching prompts for tune_id: ${project.tune_id}`)

      const promptsResponse = await fetch(`${ASTRIA_API_URL}/tunes/${project.tune_id}/prompts`, {
        headers: {
          Authorization: `Bearer ${ASTRIA_API_KEY}`,
          "Content-Type": "application/json",
        },
      })

      if (!promptsResponse.ok) {
        console.error(`❌ Astria prompts API error: ${promptsResponse.status}`)
        const errorText = await promptsResponse.text()
        console.error("Error response:", errorText)

        return NextResponse.json({
          success: false,
          error: `Astria API error: ${promptsResponse.status} - ${errorText}`,
        })
      }

      const promptsData = await promptsResponse.json()
      const prompts = promptsData.data || promptsData || []

      console.log(`📸 Found ${prompts.length} prompts for tune ${project.tune_id}`)

      // Collect all images from all prompts
      const allImages: string[] = []
      let completedPrompts = 0

      for (const prompt of prompts) {
        console.log(`🖼️ Processing prompt ${prompt.id}, status: ${prompt.status}`)

        if (prompt.status === "succeeded" && prompt.images && Array.isArray(prompt.images)) {
          const imageUrls = prompt.images
            .filter((img: any) => img.url && typeof img.url === "string")
            .map((img: any) => img.url)

          console.log(`  → Found ${imageUrls.length} images in prompt ${prompt.id}`)

          for (const url of imageUrls) {
            if (!allImages.includes(url)) {
              allImages.push(url)
            }
          }

          completedPrompts++
        }
      }

      console.log(`✅ Total unique images found: ${allImages.length} from ${completedPrompts} completed prompts`)

      if (allImages.length === 0) {
        return NextResponse.json({
          success: false,
          error: "No images found in Astria API",
          debug: {
            tuneId: project.tune_id,
            totalPrompts: prompts.length,
            completedPrompts,
            promptStatuses: prompts.map((p: any) => ({ id: p.id, status: p.status })),
          },
        })
      }

      // Get existing photos from database
      let existingPhotos: string[] = []
      if (project.generated_photos) {
        try {
          existingPhotos =
            typeof project.generated_photos === "string"
              ? JSON.parse(project.generated_photos)
              : project.generated_photos
        } catch (e) {
          console.warn("Could not parse existing photos, starting fresh")
          existingPhotos = []
        }
      }

      // Merge with existing photos (avoid duplicates)
      const combinedPhotos = [...existingPhotos]
      let newPhotosAdded = 0

      for (const newUrl of allImages) {
        if (!combinedPhotos.includes(newUrl)) {
          combinedPhotos.push(newUrl)
          newPhotosAdded++
        }
      }

      // Update project in database
      const newStatus = combinedPhotos.length >= 40 ? "completed" : "processing"

      await sql`
        UPDATE projects 
        SET 
          generated_photos = ${JSON.stringify(combinedPhotos)},
          status = ${newStatus},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      console.log(
        `✅ Updated project ${projectId}: ${newPhotosAdded} new photos added, total: ${combinedPhotos.length}`,
      )

      return NextResponse.json({
        success: true,
        imagesCount: newPhotosAdded,
        totalImages: combinedPhotos.length,
        message: `Successfully rescued ${newPhotosAdded} new photos! Total: ${combinedPhotos.length}`,
        debug: {
          tuneId: project.tune_id,
          totalPrompts: prompts.length,
          completedPrompts,
          existingPhotos: existingPhotos.length,
          newPhotos: newPhotosAdded,
        },
      })
    } catch (astriaError) {
      console.error("❌ Astria API error:", astriaError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch from Astria API: ${astriaError.message}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Manual fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
