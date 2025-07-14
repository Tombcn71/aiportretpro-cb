import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ PROMPT WEBHOOK CALLED")
    console.log("Headers:", Object.fromEntries(request.headers.entries()))
    console.log("URL:", request.url)

    const body = await request.json()
    console.log("🖼️ Prompt webhook body:", JSON.stringify(body, null, 2))

    // Handle different webhook formats
    const promptData = body.data || body
    const tuneId = promptData.tune_id
    const status = promptData.status
    const images = promptData.images

    if (!tuneId) {
      console.error("❌ No tune ID found in prompt webhook")
      return NextResponse.json({ error: "No tune ID" }, { status: 400 })
    }

    console.log(`🔍 Processing prompt for tune ${tuneId} with status: ${status}`)

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

    if (status === "succeeded" && images && Array.isArray(images)) {
      console.log(`📸 Processing ${images.length} new images`)

      // Get existing photos
      let existingPhotos: string[] = []
      if (project.generated_photos) {
        try {
          existingPhotos =
            typeof project.generated_photos === "string"
              ? JSON.parse(project.generated_photos)
              : project.generated_photos
        } catch (e) {
          console.warn("Could not parse existing photos")
          existingPhotos = []
        }
      }

      // Add new image URLs
      const newImageUrls = images
        .filter((img: any) => img.url && typeof img.url === "string")
        .map((img: any) => img.url)

      const allPhotos = [...existingPhotos]
      for (const newUrl of newImageUrls) {
        if (!allPhotos.includes(newUrl)) {
          allPhotos.push(newUrl)
        }
      }

      if (newImageUrls.length > 0) {
        await sql`
          UPDATE projects 
          SET 
            generated_photos = ${JSON.stringify(allPhotos)},
            status = CASE 
              WHEN ${allPhotos.length} >= 40 THEN 'completed'
              ELSE 'processing'
            END,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${project.id}
        `

        console.log(`✅ Added ${newImageUrls.length} photos to project ${project.id}. Total: ${allPhotos.length}`)
      }
    }

    return NextResponse.json({ success: true, processed: true })
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
