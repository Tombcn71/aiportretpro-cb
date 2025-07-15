import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    console.log("🔧 Starting database JSON fix...")

    // Get all projects with generated_photos
    const projects = await sql`
      SELECT id, name, generated_photos 
      FROM projects 
      WHERE generated_photos IS NOT NULL
    `

    console.log(`📊 Found ${projects.length} projects with photos`)

    let fixedCount = 0
    let errorCount = 0

    for (const project of projects) {
      try {
        let photos: string[] = []

        if (project.generated_photos) {
          // If it's already an array, skip
          if (Array.isArray(project.generated_photos)) {
            console.log(`✅ Project ${project.id} already has array format`)
            continue
          }

          // If it's a string, try to parse it
          if (typeof project.generated_photos === "string") {
            let jsonString = project.generated_photos

            // Handle double-escaped JSON like "\"[...]\""
            if (jsonString.startsWith('"[') && jsonString.endsWith(']"')) {
              jsonString = jsonString.slice(1, -1) // Remove outer quotes
              jsonString = jsonString.replace(/\\"/g, '"') // Unescape quotes
            }

            photos = JSON.parse(jsonString)
          }

          if (Array.isArray(photos) && photos.length > 0) {
            // Update with PostgreSQL array
            await sql`
              UPDATE projects 
              SET generated_photos = ${photos}
              WHERE id = ${project.id}
            `

            console.log(`✅ Fixed project ${project.id}: ${photos.length} photos`)
            fixedCount++
          }
        }
      } catch (error) {
        console.error(`❌ Error fixing project ${project.id}:`, error.message)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} projects, ${errorCount} errors`,
      fixedCount,
      errorCount,
      totalProjects: projects.length,
    })
  } catch (error) {
    console.error("❌ Database fix error:", error)
    return NextResponse.json(
      {
        error: "Database fix failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
