import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log("🎯 PROMPT WEBHOOK RECEIVED:", body)

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("user_id")
    const modelId = searchParams.get("model_id")
    const webhookSecret = searchParams.get("webhook_secret")

    console.log("📋 Webhook params:", { userId, modelId, webhookSecret })

    // Verify webhook secret
    if (webhookSecret !== process.env.APP_WEBHOOK_SECRET) {
      console.error("❌ Invalid webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!userId || !modelId) {
      console.error("❌ Missing required parameters")
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    let webhookData
    try {
      webhookData = JSON.parse(body)
    } catch (e) {
      console.error("❌ Invalid JSON in webhook body")
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    console.log("📦 Parsed webhook data:", JSON.stringify(webhookData, null, 2))

    // Extract image URLs from webhook data - FIX: images are in webhookData.prompt.images
    const imageUrls: string[] = []

    // Check in the prompt object first (this is where your images are!)
    if (webhookData.prompt && webhookData.prompt.images && Array.isArray(webhookData.prompt.images)) {
      for (const image of webhookData.prompt.images) {
        if (typeof image === "string" && image.startsWith("http")) {
          imageUrls.push(image)
        } else if (image && image.url && typeof image.url === "string") {
          imageUrls.push(image.url)
        }
      }
    }
    // Fallback: check in root images array
    else if (webhookData.images && Array.isArray(webhookData.images)) {
      for (const image of webhookData.images) {
        if (typeof image === "string" && image.startsWith("http")) {
          imageUrls.push(image)
        } else if (image && image.url && typeof image.url === "string") {
          imageUrls.push(image.url)
        }
      }
    }

    console.log(`📸 Found ${imageUrls.length} images in webhook`)

    if (imageUrls.length > 0) {
      // Get current photos from database
      const projectResult = await sql`
        SELECT generated_photos FROM projects WHERE id = ${modelId}
      `

      let currentPhotos: string[] = []
      if (projectResult.length > 0 && projectResult[0].generated_photos) {
        try {
          if (typeof projectResult[0].generated_photos === "string") {
            if (projectResult[0].generated_photos.startsWith("[")) {
              currentPhotos = JSON.parse(projectResult[0].generated_photos)
            } else {
              currentPhotos = [projectResult[0].generated_photos]
            }
          } else if (Array.isArray(projectResult[0].generated_photos)) {
            currentPhotos = projectResult[0].generated_photos
          }
        } catch (e) {
          console.warn("Could not parse existing photos:", e)
          currentPhotos = []
        }
      }

      // Combine and deduplicate
      const allPhotos = [...currentPhotos, ...imageUrls]
      const uniquePhotos = [...new Set(allPhotos)]

      // FIX: Use PostgreSQL array format, not JSON string
      await sql`
        UPDATE projects 
        SET generated_photos = ${uniquePhotos}, 
            status = CASE 
              WHEN ${uniquePhotos.length} >= 40 THEN 'completed'
              ELSE 'processing'
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${modelId}
      `

      console.log(`✅ Updated project ${modelId} with ${uniquePhotos.length} total photos`)
      console.log(`📸 New photos added:`, imageUrls)
    } else {
      console.log("⚠️ No images found in webhook - check structure")
    }

    return NextResponse.json({
      success: true,
      imagesFound: imageUrls.length,
      imageUrls: imageUrls,
    })
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
