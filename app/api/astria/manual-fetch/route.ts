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

    // Fetch prompts from Astria
    const response = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Astria API error:", response.status, response.statusText)
      return NextResponse.json({ error: "Failed to fetch from Astria" }, { status: response.status })
    }

    const prompts = await response.json()
    console.log("📦 Astria response:", JSON.stringify(prompts, null, 2))

    // Extract all image URLs
    const allImageUrls: string[] = []

    if (Array.isArray(prompts)) {
      for (const prompt of prompts) {
        if (prompt.images && Array.isArray(prompt.images)) {
          const urls = prompt.images.map((img: any) => img.url).filter(Boolean)
          allImageUrls.push(...urls)
        }
      }
    }

    console.log("🖼️ Found images:", allImageUrls.length)

    if (allImageUrls.length === 0) {
      return NextResponse.json({
        message: "No images found yet",
        status: project.status,
        prompts: prompts,
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

    // Update database
    await sql`
      UPDATE projects 
      SET generated_photos = ${JSON.stringify(uniquePhotos)}, 
          status = 'completed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `

    console.log("✅ Updated project with", uniquePhotos.length, "photos")

    return NextResponse.json({
      message: "Photos fetched successfully",
      photosFound: allImageUrls.length,
      totalPhotos: uniquePhotos.length,
      newPhotos: allImageUrls.length - (allImageUrls.length - (uniquePhotos.length - currentPhotos.length)),
    })
  } catch (error) {
    console.error("❌ Manual fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
