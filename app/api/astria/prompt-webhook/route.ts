import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

const appWebhookSecret = process.env.APP_WEBHOOK_SECRET

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!")
}

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ PROMPT WEBHOOK CALLED")
    console.log("Headers:", Object.fromEntries(request.headers.entries()))
    console.log("URL:", request.url)

    // Parse the incoming data - based on the other app structure
    type PromptData = {
      id: number
      text: string
      negative_prompt: string
      steps: null | number
      tune_id: number
      trained_at: string
      started_training_at: string
      created_at: string
      updated_at: string
      images: string[]
    }

    const incomingData = (await request.json()) as { prompt: PromptData }
    const { prompt } = incomingData

    console.log("🖼️ Prompt webhook data:", JSON.stringify({ prompt }, null, 2))

    // Log webhook to database for debugging
    try {
      await sql`
        INSERT INTO webhook_logs (type, payload, created_at)
        VALUES ('prompt_webhook', ${JSON.stringify(incomingData)}, CURRENT_TIMESTAMP)
      `
    } catch (logError) {
      console.warn("Could not log webhook:", logError)
    }

    // Extract URL parameters - same as other app
    const urlObj = new URL(request.url)
    const user_id = urlObj.searchParams.get("user_id")
    const model_id = urlObj.searchParams.get("model_id")
    const webhook_secret = urlObj.searchParams.get("webhook_secret")

    // Validate required parameters
    if (!model_id) {
      return NextResponse.json(
        {
          message: "Malformed URL, no model_id detected!",
        },
        { status: 500 },
      )
    }

    if (!webhook_secret) {
      return NextResponse.json(
        {
          message: "Malformed URL, no webhook_secret detected!",
        },
        { status: 500 },
      )
    }

    if (webhook_secret.toLowerCase() !== appWebhookSecret?.toLowerCase()) {
      return NextResponse.json(
        {
          message: "Unauthorized!",
        },
        { status: 401 },
      )
    }

    if (!user_id) {
      return NextResponse.json(
        {
          message: "Malformed URL, no user_id detected!",
        },
        { status: 500 },
      )
    }

    console.log(`🔍 Processing prompt for model ${model_id}, user ${user_id}`)

    // Find project by tune_id (model_id in URL corresponds to tune_id in our DB)
    const projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${model_id}
    `

    if (projects.length === 0) {
      console.error(`❌ No project found for tune_id: ${model_id}`)

      // Log all recent projects for debugging
      const allProjects = await sql`SELECT id, name, tune_id FROM projects ORDER BY created_at DESC LIMIT 10`
      console.log("Recent projects:", allProjects)

      return NextResponse.json(
        {
          message: "Project not found",
          tuneId: model_id,
          recentProjects: allProjects.map((p) => ({ id: p.id, name: p.name, tune_id: p.tune_id })),
        },
        { status: 404 },
      )
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    // Extract all headshots from the prompt - same as other app
    const allHeadshots = prompt.images
    console.log(`📸 Processing ${allHeadshots.length} images for project ${project.id}`)

    if (!allHeadshots || allHeadshots.length === 0) {
      console.log("ℹ️ No images in this webhook")
      return NextResponse.json({ message: "success" }, { status: 200 })
    }

    // Get existing photos
    let existingPhotos: string[] = []
    if (project.generated_photos) {
      try {
        existingPhotos =
          typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
      } catch (e) {
        console.warn("Could not parse existing photos, starting fresh")
        existingPhotos = []
      }
    }

    // Process each image
    const newImageUrls: string[] = []
    for (const imageUrl of allHeadshots) {
      if (typeof imageUrl === "string" && imageUrl.startsWith("http")) {
        newImageUrls.push(imageUrl)
        console.log(`✅ Added image: ${imageUrl}`)
      } else {
        console.warn(`⚠️ Invalid image URL: ${imageUrl}`)
      }
    }

    console.log(`🎯 Extracted ${newImageUrls.length} valid URLs from ${allHeadshots.length} images`)

    // Combine with existing photos
    const allPhotos = [...existingPhotos]
    let addedCount = 0

    for (const newUrl of newImageUrls) {
      if (!allPhotos.includes(newUrl)) {
        allPhotos.push(newUrl)
        addedCount++
        console.log(`➕ Added new photo: ${newUrl}`)
      } else {
        console.log(`⏭️ Skipped duplicate: ${newUrl}`)
      }
    }

    // Update database
    if (addedCount > 0) {
      try {
        await sql`
          UPDATE projects 
          SET 
            generated_photos = ${JSON.stringify(allPhotos)},
            status = CASE 
              WHEN ${allPhotos.length} >= 28 THEN 'completed'
              ELSE 'processing'
            END,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${project.id}
        `

        console.log(
          `✅ DATABASE UPDATED: Added ${addedCount} photos to project ${project.id}. Total: ${allPhotos.length}`,
        )
      } catch (dbError) {
        console.error("❌ Database update failed:", dbError)
        return NextResponse.json(
          {
            message: "Database update failed",
          },
          { status: 500 },
        )
      }
    } else {
      console.log(`ℹ️ No new photos to add (all ${newImageUrls.length} already existed)`)
    }

    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200, statusText: "Success" },
    )
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)

    // Log error to database
    try {
      await sql`
        INSERT INTO webhook_logs (type, payload, error, created_at)
        VALUES ('prompt_webhook_error', ${JSON.stringify({ error: error.message, stack: error.stack })}, ${error.message}, CURRENT_TIMESTAMP)
      `
    } catch (logError) {
      console.warn("Could not log error:", logError)
    }

    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 },
    )
  }
}
