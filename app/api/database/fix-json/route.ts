import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    console.log("🔧 Starting JSON fix...")

    // Get all projects with photos
    const projects = await sql`
      SELECT id, name, generated_photos
      FROM projects 
      WHERE generated_photos IS NOT NULL
    `

    console.log(`Found ${projects.length} projects with photos`)

    let fixedCount = 0
    let errorCount = 0

    for (const project of projects) {
      try {
        const photosData = project.generated_photos

        // Check if it's a malformed JSON string (starts with quote)
        if (typeof photosData === "string" && photosData.startsWith('"[') && photosData.endsWith(']"')) {
          console.log(`🔧 Fixing project ${project.id}: ${project.name}`)

          // Remove outer quotes and unescape
          let cleanedData = photosData.slice(1, -1) // Remove outer quotes
          cleanedData = cleanedData.replace(/\\"/g, '"') // Unescape quotes

          // Parse to get array
          const photoArray = JSON.parse(cleanedData)

          if (Array.isArray(photoArray)) {
            // Update with PostgreSQL array syntax
            await sql`
              UPDATE projects 
              SET generated_photos = ${photoArray}
              WHERE id = ${project.id}
            `
            fixedCount++
            console.log(`✅ Fixed project ${project.id} - ${photoArray.length} photos`)
          }
        } else if (Array.isArray(photosData)) {
          console.log(`✅ Project ${project.id} already has valid array`)
        } else {
          console.log(`⚠️ Project ${project.id} has unknown format:`, typeof photosData)
        }
      } catch (error) {
        console.error(`❌ Error fixing project ${project.id}:`, error.message)
        errorCount++
      }
    }

    // Check final results
    const results = await sql`
      SELECT id, name, 
             CASE 
               WHEN generated_photos IS NULL THEN 'NULL'
               WHEN array_length(generated_photos, 1) IS NULL THEN 'EMPTY ARRAY'
               ELSE array_length(generated_photos, 1)::text || ' photos'
             END as photo_count
      FROM projects 
      WHERE generated_photos IS NOT NULL
      ORDER BY id
    `

    return NextResponse.json({
      message: "JSON fix completed",
      totalProjects: projects.length,
      fixedCount,
      errorCount,
      results,
    })
  } catch (error) {
    console.error("❌ JSON fix error:", error)
    return NextResponse.json(
      {
        error: "JSON fix failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
