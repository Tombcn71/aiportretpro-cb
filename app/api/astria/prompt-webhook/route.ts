import { type NextRequest, NextResponse } from "next/server"
import { updateProjectWithGeneratedPhotos, sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  let rawBody = ""
  let projectId: string | null = null

  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("user_id")
    projectId = url.searchParams.get("model_id")
    const webhookSecret = url.searchParams.get("webhook_secret")

    console.log("🖼️ PROMPT WEBHOOK CALLED:", {
      userId,
      projectId,
      webhookSecret: webhookSecret ? "present" : "missing",
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
    })

    // Get the raw body first
    rawBody = await request.text()
    console.log("🖼️ Raw webhook body:", rawBody)

    // Log to database for debugging
    try {
      await sql`
        INSERT INTO webhook_logs (webhook_type, project_id, raw_body, status)
        VALUES ('prompt', ${projectId ? Number.parseInt(projectId) : null}, ${rawBody}, 'received')
      `
    } catch (logError) {
      console.error("Failed to log webhook:", logError)
    }

    // Verify webhook secret
    console.log("🔍 Webhook secret verification:", {
      expected: process.env.APP_WEBHOOK_SECRET,
      received: webhookSecret,
      match: webhookSecret === process.env.APP_WEBHOOK_SECRET,
    })

    if (webhookSecret !== process.env.APP_WEBHOOK_SECRET) {
      console.error("❌ Invalid webhook secret")
      console.error("Expected:", process.env.APP_WEBHOOK_SECRET)
      console.error("Received:", webhookSecret)

      // Log to database with more details
      await sql`
        INSERT INTO webhook_logs (webhook_type, project_id, raw_body, status, error_message)
        VALUES ('prompt', ${projectId ? Number.parseInt(projectId) : null}, ${rawBody}, 'failed', 'Invalid webhook secret')
      `

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body
    try {
      body = JSON.parse(rawBody)
    } catch (parseError) {
      console.error("❌ Failed to parse JSON body:", parseError)
      console.log("Raw body was:", rawBody)

      await sql`
        INSERT INTO webhook_logs (webhook_type, project_id, raw_body, status, error_message)
        VALUES ('prompt', ${projectId ? Number.parseInt(projectId) : null}, ${rawBody}, 'failed', 'JSON parse error')
      `

      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    console.log("🖼️ Parsed webhook body:", {
      id: body.id,
      status: body.status,
      imageCount: body.images?.length || 0,
      firstImage: body.images?.[0]?.substring(0, 50) + "..." || "none",
      fullBody: body,
    })

    // Log parsed data
    await sql`
      INSERT INTO webhook_logs (webhook_type, project_id, raw_body, parsed_data, status)
      VALUES ('prompt', ${projectId ? Number.parseInt(projectId) : null}, ${rawBody}, ${JSON.stringify(body)}, 'parsed')
    `

    if (!projectId) {
      console.error("❌ No model ID in webhook")
      await sql`
        INSERT INTO webhook_logs (webhook_type, project_id, raw_body, parsed_data, status, error_message)
        VALUES ('prompt', NULL, ${rawBody}, ${JSON.stringify(body)}, 'failed', 'No project ID')
      `
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
          SELECT generated_photos FROM projects WHERE id = ${Number.parseInt(projectId)}
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
        await updateProjectWithGeneratedPhotos(Number.parseInt(projectId), allGeneratedPhotos, "processing")

        // Check if we have enough images to mark as completed (expecting ~40 images total)
        if (allGeneratedPhotos.length >= 10) {
          await updateProjectWithGeneratedPhotos(Number.parseInt(projectId), allGeneratedPhotos, "completed")
          console.log(`🎉 Project ${projectId} completed with ${allGeneratedPhotos.length} total images`)
        }

        // Log success
        await sql`
          INSERT INTO webhook_logs (webhook_type, project_id, raw_body, parsed_data, status)
          VALUES ('prompt', ${Number.parseInt(projectId)}, ${rawBody}, ${JSON.stringify({
            webhookStatus,
            imageCount: newImages.length,
            totalImages: allGeneratedPhotos.length,
          })}, 'processed_success')
        `
      } else {
        console.log(`⚠️ Prompt ${webhookId} finished but no images found`)

        await sql`
          INSERT INTO webhook_logs (webhook_type, project_id, raw_body, parsed_data, status, error_message)
          VALUES ('prompt', ${Number.parseInt(projectId)}, ${rawBody}, ${JSON.stringify(body)}, 'completed_no_images', 'Webhook completed but no images found')
        `
      }
    } else if (webhookStatus === "failed" || webhookStatus === "error") {
      console.error(`❌ Prompt ${webhookId} failed with status: ${webhookStatus}`)

      // Update project status to failed if no images yet
      const currentProject = await sql`
        SELECT generated_photos FROM projects WHERE id = ${Number.parseInt(projectId)}
      `

      if (!currentProject[0]?.generated_photos || currentProject[0].generated_photos.length === 0) {
        await sql`
          UPDATE projects 
          SET status = 'failed', updated_at = CURRENT_TIMESTAMP
          WHERE id = ${Number.parseInt(projectId)}
        `
      }

      await sql`
        INSERT INTO webhook_logs (webhook_type, project_id, raw_body, parsed_data, status, error_message)
        VALUES ('prompt', ${Number.parseInt(projectId)}, ${rawBody}, ${JSON.stringify(body)}, 'failed', ${`Astria generation failed: ${webhookStatus}`})
      `
    } else {
      console.log(`🔄 Prompt ${webhookId} status: ${webhookStatus}`)

      await sql`
        INSERT INTO webhook_logs (webhook_type, project_id, raw_body, parsed_data, status)
        VALUES ('prompt', ${Number.parseInt(projectId)}, ${rawBody}, ${JSON.stringify(body)}, ${`status_${webhookStatus}`})
      `
    }

    return NextResponse.json({ received: true, processed: true })
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)

    // Log the error
    try {
      await sql`
        INSERT INTO webhook_logs (webhook_type, project_id, raw_body, status, error_message)
        VALUES ('prompt', ${projectId ? Number.parseInt(projectId) : null}, ${rawBody}, 'error', ${error.message})
      `
    } catch (logError) {
      console.error("Failed to log webhook error:", logError)
    }

    return NextResponse.json({ error: "Webhook error", details: error.message }, { status: 400 })
  }
}
