import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ ASTRIA WEBHOOK RECEIVED")

    // Parse Astria webhook data
    const data = await request.json()
    console.log("📦 Webhook data:", JSON.stringify(data, null, 2))

    // Get URL parameters
    const url = new URL(request.url)
    const model_id = url.searchParams.get("model_id")
    const webhook_secret = url.searchParams.get("webhook_secret")

    // Validate webhook secret
    if (webhook_secret !== process.env.APP_WEBHOOK_SECRET) {
      console.log("❌ Invalid webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!model_id) {
      console.log("❌ No model_id provided")
      return NextResponse.json({ error: "No model_id" }, { status: 400 })
    }

    // Find project by tune_id
    const projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${model_id}
    `

    if (projects.length === 0) {
      console.log(`❌ No project found for tune_id: ${model_id}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    // Extract images from Astria webhook - based on your example
    const images = data.prompt?.images || []
    console.log(`🖼️ Found ${images.length} images:`, images)

    if (images.length === 0) {
      console.log("ℹ️ No images in this webhook")
      return NextResponse.json({ message: "No images" }, { status: 200 })
    }

    // Get existing photos
    let existingPhotos: string[] = []
    if (project.generated_photos) {
      try {
        existingPhotos =
          typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
      } catch (e) {
        console.warn("Could not parse existing photos, starting fresh")
        existingPhotos = []
      }
    }

    // Add new images (avoid duplicates)
    const allPhotos = [...existingPhotos]
    let addedCount = 0

    for (const imageUrl of images) {
      if (typeof imageUrl === "string" && imageUrl.startsWith("http") && !allPhotos.includes(imageUrl)) {
        allPhotos.push(imageUrl)
        addedCount++
        console.log(`✅ Added: ${imageUrl}`)
      }
    }

    // Update database if we have new images
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
        WHERE id = ${project.id}
      `

      console.log(`✅ SUCCESS: Added ${addedCount} photos to project ${project.id}. Total: ${allPhotos.length}`)
    } else {
      console.log(`ℹ️ No new photos to add (${images.length} already existed)`)
    }

    return NextResponse.json({
      message: "success",
      projectId: project.id,
      imagesReceived: images.length,
      newImagesAdded: addedCount,
      totalImages: allPhotos.length,
    })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      {
        error: "Webhook failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
