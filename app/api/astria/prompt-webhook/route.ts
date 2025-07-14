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

    // Get the raw body
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

    const webhookStatus = body.status || body.state
    const imageUrl = body.images?.[0] || body.image || body.output?.[0]

    console.log("🔍 Processed prompt webhook data:", {
      webhookStatus,
      imageUrl: imageUrl ? "present" : "missing",
    })

    // If we have a completed image, add it to the project
    if (webhookStatus === "succeeded" && imageUrl) {
      try {
        // Get current photos
        const result = await sql`
          SELECT generated_photos FROM projects WHERE id = ${Number.parseInt(modelId)}
        `

        if (result.length > 0) {
          let currentPhotos = []

          // Parse existing photos
          if (result[0].generated_photos) {
            try {
              currentPhotos = JSON.parse(result[0].generated_photos)
            } catch (e) {
              console.warn("Could not parse existing photos, starting fresh")
              currentPhotos = []
            }
          }

          // Add new photo
          currentPhotos.push(imageUrl)

          // Update with new photos array as JSON string
          await sql`
            UPDATE projects 
            SET generated_photos = ${JSON.stringify(currentPhotos)}, 
                updated_at = CURRENT_TIMESTAMP,
                status = CASE 
                  WHEN ${currentPhotos.length} >= 40 THEN 'completed'
                  ELSE 'processing'
                END
            WHERE id = ${Number.parseInt(modelId)}
          `

          console.log(`✅ Added photo to project ${modelId}. Total photos: ${currentPhotos.length}`)
        }
      } catch (error) {
        console.error("❌ Error updating photos:", error)
      }
    }

    return NextResponse.json({ received: true, processed: true })
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
