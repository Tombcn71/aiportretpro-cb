import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🚨 EMERGENCY FETCH STARTING...")

    // Direct fetch from Astria API for tune 2951161
    const tuneId = "2951161"
    const projectId = 40

    console.log(`📡 Fetching prompts for tune ${tuneId}...`)

    const response = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Astria API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        {
          error: `Astria API error: ${response.status}`,
          details: errorText,
        },
        { status: 500 },
      )
    }

    const promptsData = await response.json()
    console.log(`📋 Found ${promptsData.length} prompts`)

    // Extract ALL image URLs - FIXED VERSION!
    const allImages: string[] = []

    for (const prompt of promptsData) {
      if (prompt.images && Array.isArray(prompt.images)) {
        // Images are direct strings in the array!
        for (const imageUrl of prompt.images) {
          allImages.push(imageUrl)
          console.log(`✅ Found image: ${imageUrl}`)
        }
      }
    }

    console.log(`📊 Total images found: ${allImages.length}`)

    if (allImages.length === 0) {
      return NextResponse.json(
        {
          error: "No images found in prompts",
          promptsData,
        },
        { status: 404 },
      )
    }

    // SAVE TO DATABASE IMMEDIATELY
    console.log(`💾 Saving ${allImages.length} photos to database...`)

    await sql`
      UPDATE projects 
      SET 
        generated_photos = ${JSON.stringify(allImages)},
        status = 'completed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
    `

    console.log(`✅ SUCCESS! Saved ${allImages.length} photos to project ${projectId}`)

    return NextResponse.json({
      success: true,
      message: `🎉 EMERGENCY RESCUE SUCCESS! Saved ${allImages.length} photos!`,
      tuneId,
      projectId,
      photosCount: allImages.length,
      photos: allImages,
      status: "Photos saved to database - check your dashboard!",
    })
  } catch (error) {
    console.error("❌ Emergency fetch failed:", error)
    return NextResponse.json(
      {
        error: "Emergency fetch failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
