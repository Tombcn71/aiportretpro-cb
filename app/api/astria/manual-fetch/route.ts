import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()
    console.log(`🔄 Manual fetch for project ${projectId}`)

    // Get project
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.name}`)

    if (!project.tune_id) {
      return NextResponse.json({ error: "No tune_id found" }, { status: 400 })
    }

    // Fetch from Astria API
    const response = await fetch(`https://api.astria.ai/tunes/${project.tune_id}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Astria API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`📊 Astria returned:`, JSON.stringify(data, null, 2))

    // Extract all image URLs - based on your example structure
    const allImages: string[] = []

    if (Array.isArray(data)) {
      // If it's an array of prompts
      for (const prompt of data) {
        if (prompt.images && Array.isArray(prompt.images)) {
          // Images can be either strings or objects with url property
          for (const image of prompt.images) {
            if (typeof image === "string") {
              allImages.push(image)
            } else if (image && image.url) {
              allImages.push(image.url)
            }
          }
        }
      }
    } else if (data.images && Array.isArray(data.images)) {
      // If it's a single response with images array
      for (const image of data.images) {
        if (typeof image === "string") {
          allImages.push(image)
        } else if (image && image.url) {
          allImages.push(image.url)
        }
      }
    }

    console.log(`📸 Found ${allImages.length} total images`)
    console.log(`📸 Sample images:`, allImages.slice(0, 3))

    if (allImages.length > 0) {
      // Update project with PostgreSQL array syntax
      await sql`
        UPDATE projects 
        SET 
          generated_photos = ${allImages},
          status = CASE 
            WHEN ${allImages.length} >= 40 THEN 'completed'
            ELSE 'processing'
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `

      console.log(`✅ Updated project ${projectId} with ${allImages.length} photos`)
    }

    return NextResponse.json({
      success: true,
      projectId,
      totalImages: allImages.length,
      images: allImages.slice(0, 5), // Show first 5 as sample
      rawAstriaResponse: data, // Include raw response for debugging
    })
  } catch (error) {
    console.error("❌ Manual fetch error:", error)
    return NextResponse.json(
      {
        error: "Manual fetch failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
