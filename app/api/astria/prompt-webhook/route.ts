import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ PROMPT WEBHOOK CALLED")
    console.log("Headers:", Object.fromEntries(request.headers.entries()))
    console.log("URL:", request.url)

    const body = await request.json()
    console.log("🖼️ Prompt webhook body:", JSON.stringify(body, null, 2))

    // Log webhook to database for debugging
    try {
      await sql`
        INSERT INTO webhook_logs (type, payload, created_at)
        VALUES ('prompt_webhook', ${JSON.stringify(body)}, CURRENT_TIMESTAMP)
      `
    } catch (logError) {
      console.warn("Could not log webhook:", logError)
    }

    // Handle different webhook formats - MORE ROBUST PARSING
    let promptData = body.data || body
    let tuneId = promptData.tune_id || promptData.tuneId || promptData.id
    let status = promptData.status
    let images = promptData.images

    // Try alternative data structures
    if (!tuneId && body.tune) {
      tuneId = body.tune.id || body.tune.tune_id
      promptData = body.tune
    }

    // Try URL parameters as fallback
    if (!tuneId) {
      const url = new URL(request.url)
      tuneId = url.searchParams.get("model_id") || url.searchParams.get("tune_id")
    }

    // Try to extract from nested structures
    if (!tuneId && body.prompt) {
      tuneId = body.prompt.tune_id
      promptData = body.prompt
      status = body.prompt.status
      images = body.prompt.images
    }

    console.log(`🔍 Extracted data:`, {
      tuneId,
      status,
      imageCount: images ? images.length : 0,
      promptDataKeys: Object.keys(promptData),
    })

    if (!tuneId) {
      console.error("❌ No tune ID found in prompt webhook")
      console.error("Available keys in body:", Object.keys(body))
      console.error("Available keys in promptData:", Object.keys(promptData))

      // Try to find project by other means
      const url = new URL(request.url)
      const userId = url.searchParams.get("user_id")
      const projectId = url.searchParams.get("model_id")

      if (projectId) {
        console.log(`🔄 Trying fallback with project ID: ${projectId}`)

        const projects = await sql`
          SELECT * FROM projects WHERE id = ${Number.parseInt(projectId)}
        `

        if (projects.length > 0) {
          const project = projects[0]
          console.log(`📁 Found project via fallback: ${project.id} - ${project.name}`)

          if (status === "succeeded" && images && Array.isArray(images)) {
            await processImages(project, images)
            return NextResponse.json({ success: true, processed: true, method: "fallback" })
          }
        }
      }

      return NextResponse.json({ error: "No tune ID found", debug: { body, url: request.url } }, { status: 400 })
    }

    console.log(`🔍 Processing prompt for tune ${tuneId} with status: ${status}`)

    // Find project by tune_id - MORE FLEXIBLE SEARCH
    let projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${tuneId.toString()}
    `

    // If not found, try without toString()
    if (projects.length === 0) {
      projects = await sql`
        SELECT * FROM projects WHERE tune_id = ${tuneId}
      `
    }

    // If still not found, try as integer
    if (projects.length === 0 && !isNaN(tuneId)) {
      projects = await sql`
        SELECT * FROM projects WHERE tune_id = ${Number.parseInt(tuneId)}
      `
    }

    if (projects.length === 0) {
      console.error(`❌ No project found for tune_id: ${tuneId}`)

      // Log all projects for debugging
      const allProjects = await sql`SELECT id, name, tune_id FROM projects ORDER BY created_at DESC LIMIT 10`
      console.log("Recent projects:", allProjects)

      return NextResponse.json(
        {
          error: "Project not found",
          tuneId,
          recentProjects: allProjects.map((p) => ({ id: p.id, name: p.name, tune_id: p.tune_id })),
        },
        { status: 404 },
      )
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    if (status === "succeeded" && images && Array.isArray(images)) {
      await processImages(project, images)
    } else {
      console.log(`ℹ️ Webhook received but not processing: status=${status}, images=${images ? "present" : "missing"}`)
    }

    return NextResponse.json({ success: true, processed: true })
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

    return NextResponse.json({ error: "Webhook error", details: error.message }, { status: 500 })
  }
}

async function processImages(project: any, images: any[]) {
  console.log(`📸 Processing ${images.length} new images for project ${project.id}`)

  // Get existing photos
  let existingPhotos: string[] = []
  if (project.generated_photos) {
    try {
      existingPhotos =
        typeof project.generated_photos === "string" ? JSON.parse(project.generated_photos) : project.generated_photos
    } catch (e) {
      console.warn("Could not parse existing photos")
      existingPhotos = []
    }
  }

  // Add new image URLs
  const newImageUrls = images.filter((img: any) => img.url && typeof img.url === "string").map((img: any) => img.url)

  const allPhotos = [...existingPhotos]
  let addedCount = 0

  for (const newUrl of newImageUrls) {
    if (!allPhotos.includes(newUrl)) {
      allPhotos.push(newUrl)
      addedCount++
    }
  }

  if (addedCount > 0) {
    await sql`
      UPDATE projects 
      SET 
        generated_photos = ${JSON.stringify(allPhotos)},
        status = CASE 
          WHEN ${allPhotos.length} >= 40 THEN 'completed'
          ELSE 'processing'
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${project.id}
    `

    console.log(`✅ Added ${addedCount} photos to project ${project.id}. Total: ${allPhotos.length}`)
  } else {
    console.log(`ℹ️ No new photos to add (all ${newImageUrls.length} already existed)`)
  }
}
