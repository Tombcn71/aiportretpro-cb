import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const url = new URL(request.url)

    const userId = url.searchParams.get("user_id")
    const modelId = url.searchParams.get("model_id")
    const webhookSecret = url.searchParams.get("webhook_secret")

    console.log("🖼️ Prompt webhook received:", {
      userId,
      modelId,
      webhookSecret: webhookSecret ? "present" : "missing",
      body,
    })

    // Validate webhook secret
    if (!webhookSecret || webhookSecret !== process.env.APP_WEBHOOK_SECRET) {
      console.error("❌ Invalid webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!userId || !modelId) {
      console.error("❌ Missing required parameters")
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    // Handle different webhook formats - Astria sends different structures
    const images = body.images || (body.prompt && body.prompt.images) || []

    if (!Array.isArray(images) || images.length === 0) {
      console.error("❌ No images in prompt data")
      return NextResponse.json({ error: "No images found" }, { status: 400 })
    }

    console.log("📸 Received", images.length, "images from prompt")

    // Extract image URLs
    const newImageUrls = images.filter((img: any) => img.url).map((img: any) => img.url)

    if (newImageUrls.length === 0) {
      console.error("❌ No valid image URLs found")
      return NextResponse.json({ error: "No valid images" }, { status: 400 })
    }

    // Get current images from database
    const currentProject = await sql`
      SELECT generated_photos 
      FROM projects 
      WHERE id = ${Number.parseInt(modelId)}
    `

    if (currentProject.length === 0) {
      console.error("❌ Project not found:", modelId)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Parse existing images from JSON string
    let existingImages: string[] = []
    const currentPhotos = currentProject[0].generated_photos

    if (currentPhotos) {
      try {
        // Your database stores as JSON string, so parse it
        if (typeof currentPhotos === "string") {
          existingImages = JSON.parse(currentPhotos)
        } else if (Array.isArray(currentPhotos)) {
          existingImages = currentPhotos
        }
      } catch (parseError) {
        console.warn("⚠️ Could not parse existing images, starting fresh:", parseError)
        existingImages = []
      }
    }

    // Add new images (avoid duplicates)
    const allImages = [...existingImages]
    for (const newUrl of newImageUrls) {
      if (!allImages.includes(newUrl)) {
        allImages.push(newUrl)
      }
    }

    // Update database with all images as JSON string (matching your schema)
    await sql`
      UPDATE projects 
      SET 
        generated_photos = ${JSON.stringify(allImages)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(modelId)}
    `

    console.log("✅ Updated project with", allImages.length, "total images")

    return NextResponse.json({
      success: true,
      message: "Prompt webhook processed successfully",
      totalImages: allImages.length,
      newImages: newImageUrls.length,
    })
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
