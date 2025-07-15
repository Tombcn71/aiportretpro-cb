import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ WEBHOOK CALLED")

    // Parse de data van Astria
    const data = await request.json()
    console.log("📦 Webhook data:", JSON.stringify(data, null, 2))

    // Haal URL parameters op
    const url = new URL(request.url)
    const model_id = url.searchParams.get("model_id")
    const webhook_secret = url.searchParams.get("webhook_secret")

    // Check webhook secret
    if (webhook_secret !== process.env.APP_WEBHOOK_SECRET) {
      console.log("❌ Wrong webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!model_id) {
      console.log("❌ No model_id")
      return NextResponse.json({ error: "No model_id" }, { status: 400 })
    }

    // Zoek project met tune_id
    const projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${model_id}
    `

    if (projects.length === 0) {
      console.log(`❌ No project found for tune_id: ${model_id}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    // Haal images uit de webhook data
    let images: string[] = []

    // Probeer verschillende manieren om images te vinden
    if (data.prompt?.images) {
      images = data.prompt.images
    } else if (data.images) {
      images = data.images
    } else if (data.prompt?.image_urls) {
      images = data.prompt.image_urls
    }

    console.log(`🖼️ Found ${images.length} images:`, images)

    if (images.length === 0) {
      console.log("ℹ️ No images in webhook")
      return NextResponse.json({ message: "No images" }, { status: 200 })
    }

    // Haal bestaande foto's op
    let existingPhotos: string[] = []
    if (project.generated_photos) {
      try {
        existingPhotos =
          typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
      } catch (e) {
        existingPhotos = []
      }
    }

    // Voeg nieuwe images toe
    const allPhotos = [...existingPhotos]
    let addedCount = 0

    for (const imageUrl of images) {
      if (typeof imageUrl === "string" && imageUrl.startsWith("http") && !allPhotos.includes(imageUrl)) {
        allPhotos.push(imageUrl)
        addedCount++
        console.log(`✅ Added: ${imageUrl}`)
      }
    }

    // Update database
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

      console.log(`✅ Added ${addedCount} photos to project ${project.id}. Total: ${allPhotos.length}`)
    }

    return NextResponse.json({
      message: "success",
      added: addedCount,
      total: allPhotos.length,
    })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
