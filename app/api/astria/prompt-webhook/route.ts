import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ PROMPT WEBHOOK CALLED")
    console.log("Headers:", Object.fromEntries(request.headers.entries()))
    console.log("URL:", request.url)

    const url = new URL(request.url)
    const webhookSecret = url.searchParams.get("webhook_secret")

    console.log("Webhook secret from URL:", webhookSecret)

    // Verify webhook secret
    if (webhookSecret !== process.env.APP_WEBHOOK_SECRET) {
      console.error("❌ Invalid webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("🖼️ Webhook body:", JSON.stringify(body, null, 2))

    // Extract data from webhook
    const promptData = body.prompt || body.data || body
    const tuneId = promptData.tune_id
    const status = promptData.status
    const images = promptData.images

    if (!tuneId) {
      console.error("❌ No tune ID found in webhook")
      return NextResponse.json({ error: "No tune ID" }, { status: 400 })
    }

    console.log(`🔍 Processing webhook for tune ${tuneId} with status: ${status}`)

    // Find project by tune_id - check both the main tune_id and tunes array
    let projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${tuneId.toString()}
    `

    if (projects.length === 0 && promptData.tunes && promptData.tunes.length > 0) {
      // Try with the tune_id from the tunes array
      const actualTuneId = promptData.tunes[0].id
      console.log(`🔍 Trying with actual tune_id: ${actualTuneId}`)

      projects = await sql`
        SELECT * FROM projects WHERE tune_id = ${actualTuneId.toString()}
      `
    }

    if (projects.length === 0) {
      console.error(`❌ No project found for tune_id: ${tuneId}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    // Process images if they exist
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(`📸 Processing ${images.length} new images`)

      // Get existing photos
      let existingPhotos: string[] = []
      if (project.generated_photos && Array.isArray(project.generated_photos)) {
        existingPhotos = project.generated_photos
      }

      // Extract image URLs from webhook
      const newImageUrls: string[] = []
      for (const image of images) {
        if (typeof image === "string" && image.startsWith("http")) {
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
        // Update with PostgreSQL array
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
      } else {
        console.log(`ℹ️ No new photos to add`)
      }
    }

    return NextResponse.json({
      success: true,
      processed: true,
      projectId: project.id,
      tuneId,
      status,
      imagesReceived: images?.length || 0,
    })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook error", details: error.message }, { status: 500 })
  }
}
