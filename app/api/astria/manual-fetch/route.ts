import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    console.log("🔍 Manual fetch for project:", projectId)

    // Get project details
    const projectResult = await sql`
      SELECT tune_id, status, generated_photos FROM projects WHERE id = ${projectId}
    `

    if (projectResult.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projectResult[0]
    const tuneId = project.tune_id

    if (!tuneId) {
      return NextResponse.json({ error: "No tune ID found for this project" }, { status: 400 })
    }

    console.log("📡 Fetching from Astria for tune:", tuneId)

    // Fetch prompts from Astria - this gets ALL prompts for the tune
    const response = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Astria API error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error details:", errorText)
      return NextResponse.json(
        {
          error: "Failed to fetch from Astria",
          status: response.status,
          details: errorText,
        },
        { status: response.status },
      )
    }

    const prompts = await response.json()
    console.log("📦 Astria response:", JSON.stringify(prompts, null, 2))

    // Extract all image URLs from all prompts
    const allImageUrls: string[] = []

    if (Array.isArray(prompts)) {
      console.log(`📋 Processing ${prompts.length} prompts`)

      for (const prompt of prompts) {
        console.log(`📝 Prompt ${prompt.id} status: ${prompt.status || "unknown"}`)

        if (prompt.images && Array.isArray(prompt.images)) {
          console.log(`📸 Found ${prompt.images.length} images in prompt ${prompt.id}`)

          for (const image of prompt.images) {
            if (typeof image === "string" && image.startsWith("http")) {
              allImageUrls.push(image)
            } else if (image && typeof image === "object" && image.url) {
              allImageUrls.push(image.url)
            }
          }
        } else {
          console.log(`⚠️ No images array found in prompt ${prompt.id}`)
        }
      }
    } else {
      console.log("⚠️ Response is not an array:", typeof prompts)
    }

    console.log(`🖼️ Total images found: ${allImageUrls.length}`)
    console.log(`📸 Sample URLs:`, allImageUrls.slice(0, 3))

    if (allImageUrls.length === 0) {
      return NextResponse.json({
        error: "No images found",
        message: "No images found in any prompts",
        status: project.status,
        promptCount: Array.isArray(prompts) ? prompts.length : 0,
        rawResponse: prompts,
      })
    }

    // Get existing photos
    let currentPhotos: string[] = []
    if (project.generated_photos) {
      try {
        if (typeof project.generated_photos === "string") {
          if (project.generated_photos.startsWith("[")) {
            currentPhotos = JSON.parse(project.generated_photos)
          } else {
            currentPhotos = [project.generated_photos]
          }
        } else if (Array.isArray(project.generated_photos)) {
          currentPhotos = project.generated_photos
        }
      } catch (e) {
        console.warn("Could not parse existing photos:", e)
        currentPhotos = []
      }
    }

    // Combine and deduplicate
    const allPhotos = [...currentPhotos, ...allImageUrls]
    const uniquePhotos = [...new Set(allPhotos)]

    console.log(
      `📊 Photo counts: existing=${currentPhotos.length}, new=${allImageUrls.length}, unique=${uniquePhotos.length}`,
    )

    // Update database with JSON string (to match your current structure)
    await sql`
      UPDATE projects 
      SET generated_photos = ${JSON.stringify(uniquePhotos)}, 
          status = 'completed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `

    console.log("✅ Updated project with", uniquePhotos.length, "photos")

    return NextResponse.json({
      success: true,
      message: "Photos fetched successfully",
      photosFound: allImageUrls.length,
      totalPhotos: uniquePhotos.length,
      newPhotos:
        allImageUrls.length -
        (currentPhotos.length > 0 ? uniquePhotos.length - currentPhotos.length : allImageUrls.length),
      sampleUrls: allImageUrls.slice(0, 5),
    })
  } catch (error) {
    console.error("❌ Manual fetch error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
