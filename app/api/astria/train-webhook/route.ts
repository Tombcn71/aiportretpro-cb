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

    console.log("🎯 Train webhook received:", {
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

    const tune = body.tune
    if (!tune || !tune.id) {
      console.error("❌ Invalid tune data")
      return NextResponse.json({ error: "Invalid tune data" }, { status: 400 })
    }

    console.log("✅ Training completed for tune:", tune.id)

    // Update project with tune ID and status
    const updateResult = await sql`
      UPDATE projects 
      SET 
        prediction_id = ${tune.id.toString()},
        status = 'completed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(modelId)}
      RETURNING id, name, status, prediction_id
    `

    if (updateResult.length === 0) {
      console.error("❌ Project not found:", modelId)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log("✅ Project updated:", updateResult[0])

    // Try to fetch generated images from Astria
    try {
      const imagesResponse = await fetch(`https://api.astria.ai/tunes/${tune.id}/prompts`, {
        headers: {
          Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        },
      })

      if (imagesResponse.ok) {
        const promptsData = await imagesResponse.json()
        console.log("📸 Fetched prompts from Astria:", promptsData.length || 0)

        // Extract image URLs from prompts
        const imageUrls: string[] = []
        if (Array.isArray(promptsData)) {
          for (const prompt of promptsData) {
            if (prompt.images && Array.isArray(prompt.images)) {
              for (const image of prompt.images) {
                if (image.url) {
                  imageUrls.push(image.url)
                }
              }
            }
          }
        }

        if (imageUrls.length > 0) {
          // Store images in database as JSON string (matching your schema)
          await sql`
            UPDATE projects 
            SET generated_photos = ${JSON.stringify(imageUrls)}
            WHERE id = ${Number.parseInt(modelId)}
          `
          console.log("✅ Stored", imageUrls.length, "images in database as JSON string")
        }
      }
    } catch (imageError) {
      console.error("⚠️ Could not fetch images (training still successful):", imageError)
    }

    return NextResponse.json({
      success: true,
      message: "Training webhook processed successfully",
      tuneId: tune.id,
    })
  } catch (error) {
    console.error("❌ Train webhook error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
