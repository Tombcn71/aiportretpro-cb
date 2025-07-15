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

    // IMPROVED PARSING based on yesterday's findings - images come via 'images' not '.images'
    let promptData = body.data || body
    let tuneId = null
    let status = null
    let images = null

    // Try multiple ways to extract tune_id
    if (promptData.tune_id) {
      tuneId = promptData.tune_id
    } else if (promptData.tuneId) {
      tuneId = promptData.tuneId
    } else if (promptData.id) {
      tuneId = promptData.id
    } else if (body.tune && body.tune.id) {
      tuneId = body.tune.id
      promptData = body.tune
    } else if (body.prompt && body.prompt.tune_id) {
      tuneId = body.prompt.tune_id
      promptData = body.prompt
    }

    // Try URL parameters as fallback
    if (!tuneId) {
      const url = new URL(request.url)
      tuneId = url.searchParams.get("model_id") || url.searchParams.get("tune_id")
    }

    // Extract status
    status = promptData.status || body.status || (body.prompt && body.prompt.status)

    // CRITICAL FIX: Extract images - they come via 'images' property directly
    if (body.images) {
      images = body.images
      console.log("✅ Found images in body.images")
    } else if (promptData.images) {
      images = promptData.images
      console.log("✅ Found images in promptData.images")
    } else if (body.prompt && body.prompt.images) {
      images = body.prompt.images
      console.log("✅ Found images in body.prompt.images")
    } else if (body.data && body.data.images) {
      images = body.data.images
      console.log("✅ Found images in body.data.images")
    }

    console.log(`🔍 Extracted data:`, {
      tuneId,
      status,
      imagesFound: !!images,
      imagesType: typeof images,
      imagesLength: Array.isArray(images) ? images.length : "not array",
      imagesPreview: Array.isArray(images) ? images.slice(0, 2) : images,
      bodyKeys: Object.keys(body),
      promptDataKeys: Object.keys(promptData),
    })

    if (!tuneId) {
      console.error("❌ No tune ID found in prompt webhook")
      console.error("Full body structure:", JSON.stringify(body, null, 2))

      // Try to find project by other means - check recent projects
      const recentProjects = await sql`
        SELECT id, name, tune_id, status, created_at
        FROM projects 
        WHERE tune_id IS NOT NULL 
        AND status IN ('training', 'processing')
        ORDER BY created_at DESC 
        LIMIT 5
      `

      console.log("Recent projects with tune_id:", recentProjects)

      // If we have images but no tune_id, try to match by timing
      if (images && Array.isArray(images) && images.length > 0 && recentProjects.length > 0) {
        console.log("🔄 Attempting to match by recent project...")
        const mostRecentProject = recentProjects[0]

        console.log(`📁 Using most recent project as fallback: ${mostRecentProject.id} - ${mostRecentProject.name}`)

        if (status === "succeeded" || status === "completed") {
          await processImages(mostRecentProject, images)
          return NextResponse.json({
            success: true,
            processed: true,
            method: "fallback_recent_project",
            projectId: mostRecentProject.id,
          })
        }
      }

      return NextResponse.json(
        {
          error: "No tune ID found",
          debug: {
            bodyKeys: Object.keys(body),
            promptDataKeys: Object.keys(promptData),
            recentProjects: recentProjects.map((p) => ({ id: p.id, tune_id: p.tune_id })),
          },
        },
        { status: 400 },
      )
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
    if (projects.length === 0 && !isNaN(Number(tuneId))) {
      projects = await sql`
        SELECT * FROM projects WHERE tune_id = ${Number(tuneId)}
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

    // CRITICAL: Check if we have images and status is success
    if ((status === "succeeded" || status === "completed") && images) {
      console.log(
        `📸 Processing images - Type: ${typeof images}, Length: ${Array.isArray(images) ? images.length : "not array"}`,
      )

      if (Array.isArray(images)) {
        await processImages(project, images)
        console.log(`✅ Successfully processed ${images.length} images for project ${project.id}`)
      } else {
        console.error("❌ Images is not an array:", images)
        return NextResponse.json(
          {
            error: "Images data is not in expected format",
            imagesType: typeof images,
            images: images,
          },
          { status: 400 },
        )
      }
    } else {
      console.log(`ℹ️ Webhook received but not processing: status=${status}, images=${images ? "present" : "missing"}`)
      console.log(`Images type: ${typeof images}, Array: ${Array.isArray(images)}`)
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
  console.log(`📸 Processing ${images.length} images for project ${project.id}`)
  console.log(`First image sample:`, images[0])

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

  // IMPROVED IMAGE URL EXTRACTION - based on yesterday's findings
  const newImageUrls: string[] = []

  for (const img of images) {
    let imageUrl = null

    // Try different ways to extract URL - images come as direct URLs or objects
    if (typeof img === "string" && img.startsWith("http")) {
      imageUrl = img
      console.log(`✅ Found direct URL: ${img}`)
    } else if (img && typeof img === "object") {
      if (img.url && typeof img.url === "string") {
        imageUrl = img.url
        console.log(`✅ Found URL in object: ${img.url}`)
      } else if (img.image_url && typeof img.image_url === "string") {
        imageUrl = img.image_url
        console.log(`✅ Found image_url in object: ${img.image_url}`)
      } else if (img.src && typeof img.src === "string") {
        imageUrl = img.src
        console.log(`✅ Found src in object: ${img.src}`)
      } else {
        console.warn(`⚠️ Object found but no URL property:`, Object.keys(img))
      }
    } else {
      console.warn(`⚠️ Unexpected image format:`, typeof img, img)
    }

    if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http")) {
      newImageUrls.push(imageUrl)
    }
  }

  console.log(`🎯 Extracted ${newImageUrls.length} valid URLs from ${images.length} images`)

  if (newImageUrls.length === 0) {
    console.error("❌ No valid image URLs found!")
    return
  }

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

  if (addedCount > 0) {
    try {
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

      console.log(
        `✅ DATABASE UPDATED: Added ${addedCount} photos to project ${project.id}. Total: ${allPhotos.length}`,
      )
    } catch (dbError) {
      console.error("❌ Database update failed:", dbError)
      throw dbError
    }
  } else {
    console.log(`ℹ️ No new photos to add (all ${newImageUrls.length} already existed)`)
  }
}
