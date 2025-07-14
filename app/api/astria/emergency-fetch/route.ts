import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    console.log("🚨 EMERGENCY FETCH STARTING...")

    const tuneId = "2951161"
    const projectId = 40

    console.log(`📡 Fetching prompts for tune ${tuneId}...`)

    // Fetch prompts from Astria API
    const response = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Astria API error: ${response.status}`)
    }

    const prompts = await response.json()
    console.log(`📊 Found ${prompts.length} prompts`)

    // Extract all image URLs from all prompts
    const allImages: string[] = []

    for (const prompt of prompts) {
      if (prompt.images && Array.isArray(prompt.images)) {
        console.log(`📸 Prompt ${prompt.id}: ${prompt.images.length} images`)
        allImages.push(...prompt.images)
      }
    }

    console.log(`🎯 Total images found: ${allImages.length}`)

    if (allImages.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No images found in prompts",
        debug: {
          promptsCount: prompts.length,
          prompts: prompts.map((p: any) => ({
            id: p.id,
            hasImages: !!p.images,
            imageCount: p.images?.length || 0,
          })),
        },
      })
    }

    // Update database with the images
    console.log(`💾 Updating project ${projectId} in database...`)

    const result = await sql`
      UPDATE projects 
      SET 
        generated_photos = ${JSON.stringify(allImages)},
        status = 'completed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
      RETURNING id, name, status, generated_photos
    `

    if (result.length === 0) {
      throw new Error(`Project ${projectId} not found`)
    }

    const updatedProject = result[0]
    console.log(`✅ Project updated: ${updatedProject.name}`)

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${allImages.length} photos to project ${projectId}`,
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        status: updatedProject.status,
        photoCount: allImages.length,
      },
      images: allImages,
    })
  } catch (error) {
    console.error("❌ Emergency fetch failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Emergency fetch failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
