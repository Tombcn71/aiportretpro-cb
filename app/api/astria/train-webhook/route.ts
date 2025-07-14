import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🔥 Train webhook received")

    const body = await request.json()
    console.log("Train webhook body:", JSON.stringify(body, null, 2))

    // Check if this is a completed training
    if (body.data?.object === "tune" && body.data?.status === "succeeded") {
      const tuneId = body.data.id
      console.log(`✅ Training completed for tune: ${tuneId}`)

      // Find project with this tune_id
      const projects = await sql`
        SELECT * FROM projects WHERE tune_id = ${tuneId}
      `

      if (projects.length === 0) {
        console.log(`❌ No project found for tune_id: ${tuneId}`)
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      const project = projects[0]
      console.log(`📁 Found project: ${project.id} - ${project.name}`)

      // Fetch all prompts for this tune from Astria API
      const astriaResponse = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
        headers: {
          Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
          "Content-Type": "application/json",
        },
      })

      if (!astriaResponse.ok) {
        console.error("Failed to fetch prompts from Astria:", astriaResponse.status)
        return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 })
      }

      const promptsData = await astriaResponse.json()
      console.log(`📸 Found ${promptsData.length} prompts`)

      // Collect all image URLs
      const allPhotos: string[] = []

      for (const prompt of promptsData) {
        if (prompt.images && Array.isArray(prompt.images)) {
          for (const image of prompt.images) {
            if (image.url && typeof image.url === "string") {
              allPhotos.push(image.url)
            }
          }
        }
      }

      console.log(`🖼️ Collected ${allPhotos.length} photos`)

      if (allPhotos.length > 0) {
        // Update project with photos
        await sql`
          UPDATE projects 
          SET generated_photos = ${JSON.stringify(allPhotos)}, 
              status = ${allPhotos.length >= 40 ? "completed" : "processing"},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${project.id}
        `

        console.log(`✅ Updated project ${project.id} with ${allPhotos.length} photos`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Train webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
