import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const modelId = url.searchParams.get("model_id")
    const webhookSecret = url.searchParams.get("webhook_secret")

    console.log("🔔 Webhook received:", { modelId, webhookSecret })

    // Verify webhook secret
    if (webhookSecret !== process.env.APP_WEBHOOK_SECRET) {
      console.error("❌ Invalid webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("📦 Webhook data:", JSON.stringify(data, null, 2))

    // Extract images from webhook data based on your example
    const images = data?.prompt?.images || []

    if (!Array.isArray(images) || images.length === 0) {
      console.log("⚠️ No images found in webhook")
      return NextResponse.json({ message: "No images in webhook" })
    }

    console.log(`🖼️ Found ${images.length} images in webhook`)

    // Find project by tune_id (model_id)
    const projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${modelId}
    `

    if (projects.length === 0) {
      console.error(`❌ No project found for tune_id: ${modelId}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    // Get existing photos (now as PostgreSQL array)
    let existingPhotos: string[] = []
    if (project.generated_photos && Array.isArray(project.generated_photos)) {
      existingPhotos = project.generated_photos
    }

    console.log(`📸 Existing photos: ${existingPhotos.length}`)

    // Add new images
    const allPhotos = [...existingPhotos]
    let addedCount = 0

    for (const imageUrl of images) {
      if (typeof imageUrl === "string" && imageUrl.startsWith("http") && !allPhotos.includes(imageUrl)) {
        allPhotos.push(imageUrl)
        addedCount++
        console.log(`✅ Added: ${imageUrl}`)
      }
    }

    if (addedCount === 0) {
      console.log("ℹ️ No new images to add")
      return NextResponse.json({ message: "No new images" })
    }

    // Update database with PostgreSQL array (not JSON string!)
    await sql`
      UPDATE projects 
      SET 
        generated_photos = ${allPhotos},
        status = CASE 
          WHEN ${allPhotos.length} >= 28 THEN 'completed'
          ELSE 'processing'
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${project.id}
    `

    console.log(`✅ Webhook SUCCESS: Added ${addedCount} photos. Total: ${allPhotos.length}`)

    return NextResponse.json({
      message: "success",
      projectId: project.id,
      newImages: addedCount,
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
