import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getTunePrompts } from "@/lib/astria"

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 })
    }

    console.log(`🚑 MANUAL RESCUE for project ${projectId}`)

    // Get project
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]

    if (!project.tune_id) {
      return NextResponse.json({ error: "No tune_id found for project" }, { status: 400 })
    }

    console.log(`📡 Fetching prompts for tune ${project.tune_id}`)

    // Fetch prompts from Astria
    const promptsData = await getTunePrompts(project.tune_id)

    if (!promptsData || !Array.isArray(promptsData)) {
      return NextResponse.json({ error: "No prompts data received" }, { status: 404 })
    }

    console.log(`📸 Found ${promptsData.length} prompts`)

    // Extract all images from all prompts
    const allImages: string[] = []

    for (const prompt of promptsData) {
      if (prompt.images && Array.isArray(prompt.images)) {
        for (const image of prompt.images) {
          if (image.url && typeof image.url === "string") {
            allImages.push(image.url)
          }
        }
      }
    }

    console.log(`🖼️ Found ${allImages.length} total images`)

    if (allImages.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No images found in prompts",
        promptsCount: promptsData.length,
      })
    }

    // Update project with images
    await sql`
      UPDATE projects 
      SET 
        generated_photos = ${JSON.stringify(allImages)},
        status = 'completed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `

    console.log(`✅ Rescued ${allImages.length} images for project ${projectId}`)

    return NextResponse.json({
      success: true,
      message: `Successfully rescued ${allImages.length} images`,
      imagesCount: allImages.length,
      promptsCount: promptsData.length,
    })
  } catch (error) {
    console.error("❌ Manual rescue error:", error)
    return NextResponse.json(
      {
        error: "Rescue failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
