import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ PROMPT WEBHOOK CALLED")

    const body = await request.json()
    console.log("🖼️ Webhook body:", JSON.stringify(body, null, 2))

    // Extract data from webhook - handle different formats
    const promptData = body.prompt || body.data || body
    const tuneId = promptData.tune_id
    const status = promptData.status
    const images = promptData.images

    if (!tuneId) {
      console.error("❌ No tune ID found in webhook")
      return NextResponse.json({ error: "No tune ID" }, { status: 400 })
    }

    console.log(`🔍 Processing webhook for tune ${tuneId} with status: ${status}`)

    // Find project by tune_id
    const projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${tuneId.toString()}
    `

    if (projects.length === 0) {
      console.error(`❌ No project found for tune_id: ${tuneId}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    // Process images if status is succeeded and images exist
    if (status === "succeeded" && images && Array.isArray(images) && images.length > 0) {
      console.log(`📸 Processing ${images.length} new images`)

      // Get existing photos (now as PostgreSQL array)
      let existingPhotos: string[] = []
      if (project.generated_photos && Array.isArray(project.generated_photos)) {
        existingPhotos = project.generated_photos
      }

      // Extract image URLs from webhook
      const newImageUrls: string[] = []
      for (const image of images) {
        if (typeof image === "string") {
          newImageUrls.push(image)
        } else if (image && image.url) {
          newImageUrls.push(image.url)
        }
      }

      // Combine with existing photos
      const allPhotos = [...existingPhotos]
      let addedCount = 0

      for (const newUrl of newImageUrls) {
        if (!allPhotos.includes(newUrl)) {
          allPhotos.push(newUrl)
          addedCount++
        }
      }

      if (addedCount > 0) {
        // Update with PostgreSQL array (not JSON string!)
        await sql`
          UPDATE projects 
          SET 
            generated_photos = ${allPhotos},
            status = CASE 
              WHEN ${allPhotos.length} >= 40 THEN 'completed'
              ELSE 'processing'
            END,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${project.id}
        `

        console.log(`✅ Webhook: Added ${addedCount} photos to project ${project.id}. Total: ${allPhotos.length}`)
      }
    }

    return NextResponse.json({
      success: true,
      processed: true,
      tuneId,
      status,
      imagesReceived: images?.length || 0,
    })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
