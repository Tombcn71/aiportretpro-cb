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

    if (!modelId) {
      console.error("❌ No model ID in webhook")
      return NextResponse.json({ error: "No model ID" }, { status: 400 })
    }

    console.log("🔥 Prompt webhook received")

    const body = await request.json()
    console.log("Prompt webhook body:", JSON.stringify(body, null, 2))

    // Check if this is a completed prompt with images
    if (body.data?.object === "prompt" && body.data?.status === "succeeded" && body.data?.images) {
      const tuneId = body.data.tune_id
      const images = body.data.images

      console.log(`✅ Prompt completed for tune: ${tuneId}`)
      console.log(`📸 Received ${images.length} images`)

      // Find project with this tune_id
      const projects = await sql`
        SELECT * FROM projects WHERE tune_id = ${tuneId}
      `

      if (projects.length === 0) {
        console.log(`❌ No project found for tune_id: ${tuneId}`)
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      const project = projects[0]
      console.log(`📁 Found project: ${project.id} - ${project.name}`)

      // Parse existing photos
      let existingPhotos: string[] = []
      try {
        if (project.generated_photos) {
          existingPhotos =
            typeof project.generated_photos === "string"
              ? JSON.parse(project.generated_photos)
              : project.generated_photos
        }
      } catch (e) {
        console.log("Error parsing existing photos, starting fresh")
        existingPhotos = []
      }

      // Add new photos
      const newPhotos: string[] = []
      for (const image of images) {
        if (image.url && typeof image.url === "string" && !existingPhotos.includes(image.url)) {
          newPhotos.push(image.url)
        }
      }

      if (newPhotos.length > 0) {
        const allPhotos = [...existingPhotos, ...newPhotos]

        // Update project with new photos
        await sql`
          UPDATE projects 
          SET generated_photos = ${JSON.stringify(allPhotos)}, 
              status = ${allPhotos.length >= 40 ? "completed" : "processing"},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${project.id}
        `

        console.log(`✅ Added ${newPhotos.length} new photos to project ${project.id}. Total: ${allPhotos.length}`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Prompt webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
