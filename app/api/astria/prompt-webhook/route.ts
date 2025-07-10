import { type NextRequest, NextResponse } from "next/server"
import { updateProjectWithGeneratedPhotos, sql } from "@/lib/db"

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
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    })

    // Verify webhook secret
    if (webhookSecret !== process.env.APP_WEBHOOK_SECRET) {
      console.error("❌ Invalid webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the raw body first
    const rawBody = await request.text()
    console.log("🖼️ Raw webhook body:", rawBody)

    let body
    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error("❌ Failed to parse JSON body:", parseError)
      console.log("Raw body was:", rawBody)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    console.log("🖼️ Parsed webhook body:", {
      id: body.id,
      status: body.status,
      imageCount: body.images?.length || 0,
      firstImage: body.images?.[0]?.substring(0, 50) + "..." || "none",
      fullBody: body,
    })

    if (!modelId) {
      console.error("❌ No model ID in webhook")
      return NextResponse.json({ error: "No model ID" }, { status: 400 })
    }

    // Handle different webhook formats from Astria
    const webhookStatus = body.status || body.state || body.tune?.status
    const webhookImages = body.images || body.outputs || body.tune?.images || []
    const webhookId = body.id || body.tune?.id || "unknown"

    console.log("🔍 Processed webhook data:", {
      webhookStatus,
      webhookImages: webhookImages.length,
      webhookId,
    })

    if (webhookStatus === "finished" || webhookStatus === "completed") {
      if (webhookImages && webhookImages.length > 0) {
        console.log(`✅ Prompt ${webhookId} completed with ${webhookImages.length} images`)

        // Get current generated photos and add new ones using Neon
        const currentProject = await sql`
          SELECT generated_photos FROM projects WHERE id = ${Number.parseInt(modelId)}
        `

        let allGeneratedPhotos = []
        if (currentProject[0]?.generated_photos) {
          allGeneratedPhotos = [...currentProject[0].generated_photos]
        }

        // Add new images (handle different formats)
        const newImages = webhookImages
          .map((img: any) => {
            if (typeof img === "string") return img
            if (img.url) return img.url
            if (img.image) return img.image
            return img
          })
          .filter(Boolean)

        allGeneratedPhotos.push(...newImages)

        console.log(`📸 Total photos now: ${allGeneratedPhotos.length}`)

        // Update project with all generated photos using Neon
        await updateProjectWithGeneratedPhotos(Number.parseInt(modelId), allGeneratedPhotos, "processing")

        // Check if we have enough images to mark as completed (expecting ~40 images total)
        if (allGeneratedPhotos.length >= 10) {
          await updateProjectWithGeneratedPhotos(Number.parseInt(modelId), allGeneratedPhotos, "completed")
          console.log(`🎉 Project ${modelId} completed with ${allGeneratedPhotos.length} total images`)
        }
      } else {
        console.log(`⚠️ Prompt ${webhookId} finished but no images found`)
      }
    } else if (webhookStatus === "failed" || webhookStatus === "error") {
      console.error(`❌ Prompt ${webhookId} failed with status: ${webhookStatus}`)

      // Update project status to failed if no images yet
      const currentProject = await sql`
        SELECT generated_photos FROM projects WHERE id = ${Number.parseInt(modelId)}
      `

      if (!currentProject[0]?.generated_photos || currentProject[0].generated_photos.length === 0) {
        await sql`
          UPDATE projects 
          SET status = 'failed', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${Number.parseInt(modelId)}
        `
      }
    } else {
      console.log(`🔄 Prompt ${webhookId} status: ${webhookStatus}`)
    }

    return NextResponse.json({ received: true, processed: true })
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
