import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    console.log("🖼️ ASTRIA WEBHOOK CALLED")
    console.log("📍 URL:", request.url)
    console.log("📋 Headers:", Object.fromEntries(request.headers.entries()))

    // Parse de exacte data die Astria stuurt
    const astriaData = await request.json()

    // Log de EXACTE data structuur van Astria
    console.log("🎯 EXACT ASTRIA DATA:")
    console.log(JSON.stringify(astriaData, null, 2))

    // Log ook de keys om te zien wat er beschikbaar is
    console.log("🔑 Available keys:", Object.keys(astriaData))

    if (astriaData.prompt) {
      console.log("🔑 Prompt keys:", Object.keys(astriaData.prompt))
    }

    // Sla de exacte webhook data op voor analyse
    try {
      await sql`
        INSERT INTO webhook_logs (type, payload, created_at)
        VALUES ('astria_exact_data', ${JSON.stringify(astriaData)}, CURRENT_TIMESTAMP)
      `
      console.log("✅ Logged exact Astria data to database")
    } catch (logError) {
      console.warn("⚠️ Could not log to database:", logError)
    }

    // Haal URL parameters op
    const url = new URL(request.url)
    const model_id = url.searchParams.get("model_id")
    const webhook_secret = url.searchParams.get("webhook_secret")

    console.log("🔍 URL Parameters:", { model_id, webhook_secret })

    // Basic validatie
    if (webhook_secret !== process.env.APP_WEBHOOK_SECRET) {
      console.log("❌ Wrong webhook secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!model_id) {
      console.log("❌ No model_id")
      return NextResponse.json({ error: "No model_id" }, { status: 400 })
    }

    // Zoek project
    const projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${model_id}
    `

    if (projects.length === 0) {
      console.log(`❌ No project found for tune_id: ${model_id}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    // Nu gaan we ALLE mogelijke plekken checken waar images kunnen staan
    let foundImages: string[] = []

    // Check verschillende mogelijke locaties voor images
    const possibleImageLocations = [
      astriaData.images,
      astriaData.prompt?.images,
      astriaData.prompt?.image_urls,
      astriaData.image_urls,
      astriaData.outputs,
      astriaData.prompt?.outputs,
      astriaData.results,
      astriaData.prompt?.results,
    ]

    console.log("🔍 Checking all possible image locations:")
    possibleImageLocations.forEach((location, index) => {
      console.log(`Location ${index}:`, location)
      if (Array.isArray(location)) {
        foundImages = [...foundImages, ...location.filter((img) => typeof img === "string" && img.startsWith("http"))]
      }
    })

    console.log(`🖼️ Found ${foundImages.length} images total:`, foundImages)

    // Als we images hebben gevonden, sla ze op
    if (foundImages.length > 0) {
      // Haal bestaande foto's op
      let existingPhotos: string[] = []
      if (project.generated_photos) {
        try {
          existingPhotos =
            typeof project.generated_photos === "string"
              ? JSON.parse(project.generated_photos)
              : project.generated_photos
        } catch (e) {
          existingPhotos = []
        }
      }

      // Voeg nieuwe images toe (geen duplicaten)
      const allPhotos = [...existingPhotos]
      let addedCount = 0

      for (const imageUrl of foundImages) {
        if (!allPhotos.includes(imageUrl)) {
          allPhotos.push(imageUrl)
          addedCount++
          console.log(`✅ Added new image: ${imageUrl}`)
        }
      }

      // Update database
      if (addedCount > 0) {
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

        console.log(`✅ UPDATED PROJECT: Added ${addedCount} photos. Total: ${allPhotos.length}`)
      }

      return NextResponse.json({
        message: "success",
        foundImages: foundImages.length,
        addedNew: addedCount,
        totalPhotos: allPhotos.length,
        astriaDataKeys: Object.keys(astriaData),
        promptKeys: astriaData.prompt ? Object.keys(astriaData.prompt) : null,
      })
    } else {
      console.log("ℹ️ No images found in webhook data")
      return NextResponse.json({
        message: "no images found",
        astriaDataKeys: Object.keys(astriaData),
        promptKeys: astriaData.prompt ? Object.keys(astriaData.prompt) : null,
        fullData: astriaData,
      })
    }
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      {
        error: "Webhook failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
