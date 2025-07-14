import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("user_id")
    const modelId = url.searchParams.get("model_id")
    const webhookSecret = url.searchParams.get("webhook_secret")

    console.log("🖼️ PROMPT WEBHOOK CALLED:", {
      userId,
      modelId,
      webhookSecret: webhookSecret ? "present" : "missing",
      timestamp: new Date().toISOString(),
    })

    // Verify webhook secret
    if (webhookSecret !== process.env.APP_WEBHOOK_SECRET) {
      console.error("❌ Invalid webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the raw body first
    const rawBody = await request.text()
    console.log("🖼️ Raw prompt webhook body:", rawBody)

    let body
    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error("❌ Failed to parse JSON body:", parseError)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    console.log("🖼️ Parsed prompt webhook body:", body)

    if (!modelId) {
      console.error("❌ No model ID in webhook")
      return NextResponse.json({ error: "No model ID" }, { status: 400 })
    }

    // Extract images from webhook
    const images = body.images || (body.prompt && body.prompt.images) || []

    if (!Array.isArray(images) || images.length === 0) {
      console.log("⚠️ No images in this webhook, might be status update")
      return NextResponse.json({ received: true, processed: true })
    }

    // Get image URLs
    const imageUrls = images.filter((img) => img && img.url).map((img) => img.url)

    if (imageUrls.length === 0) {
      console.log("⚠️ No valid image URLs found")
      return NextResponse.json({ received: true, processed: true })
    }

    console.log(`📸 Found ${imageUrls.length} new images`)

    // Get current project
    const currentProject = await sql`
      SELECT generated_photos 
      FROM projects 
      WHERE id = ${Number.parseInt(modelId)}
    `

    if (currentProject.length === 0) {
      console.error("❌ Project not found:", modelId)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Parse existing photos
    let existingPhotos = []
    const currentPhotos = currentProject[0].generated_photos

    if (currentPhotos) {
      try {
        if (typeof currentPhotos === "string") {
          existingPhotos = JSON.parse(currentPhotos)
        } else if (Array.isArray(currentPhotos)) {
          existingPhotos = currentPhotos
        }
      } catch (e) {
        console.warn("Could not parse existing photos, starting fresh")
        existingPhotos = []
      }
    }

    // Add new images (avoid duplicates)
    const allPhotos = [...existingPhotos]
    for (const newUrl of imageUrls) {
      if (!allPhotos.includes(newUrl)) {
        allPhotos.push(newUrl)
      }
    }

    // Update database with all photos as JSON string
    await sql`
      UPDATE projects 
      SET 
        generated_photos = ${JSON.stringify(allPhotos)},
        status = 'completed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(modelId)}
    `

    console.log(`✅ Updated project ${modelId} with ${allPhotos.length} total photos`)

    return NextResponse.json({
      received: true,
      processed: true,
      totalPhotos: allPhotos.length,
      newPhotos: imageUrls.length,
    })
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
