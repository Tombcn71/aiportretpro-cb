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

    const prompt = body.prompt
    if (!prompt || !prompt.images || !Array.isArray(prompt.images)) {
      console.error("❌ No images in prompt data")
      return NextResponse.json({ error: "No images found" }, { status: 400 })
    }

    console.log("📸 Received", prompt.images.length, "images from prompt")

    // Extract image URLs
    const newImageUrls = prompt.images.filter((img: any) => img.url).map((img: any) => img.url)

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

    // Merge with existing images
    let existingImages: string[] = []
    try {
      const currentPhotos = currentProject[0].generated_photos
      if (currentPhotos && typeof currentPhotos === "object" && Array.isArray(currentPhotos)) {
        existingImages = currentPhotos
      } else if (typeof currentPhotos === "string") {
        existingImages = JSON.parse(currentPhotos)
      }
    } catch (parseError) {
      console.warn("⚠️ Could not parse existing images, starting fresh")
      existingImages = []
    }

    // Add new images (avoid duplicates)
    const allImages = [...existingImages]
    for (const newUrl of newImageUrls) {
      if (!allImages.includes(newUrl)) {
        allImages.push(newUrl)
      }
    }

    // Update database with all images
    await sql`
      UPDATE projects 
      SET 
        generated_photos = ${JSON.stringify(allImages)}::jsonb,
        updated_at = NOW()
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
