import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    console.log("🔧 Starting database JSON fix...")

    // Get all projects with malformed JSON in generated_photos
    const projects = await sql`
      SELECT id, name, generated_photos 
      FROM projects 
      WHERE generated_photos IS NOT NULL 
      AND generated_photos != '[]'
      AND generated_photos != ''
    `

    console.log(`📊 Found ${projects.length} projects to check`)

    let fixedCount = 0
    const results = []

    for (const project of projects) {
      try {
        let photos: string[] = []

        // Try to parse the existing data
        if (typeof project.generated_photos === "string") {
          // If it's a string, try to parse it
          try {
            photos = JSON.parse(project.generated_photos)
          } catch (parseError) {
            // If parsing fails, try to extract URLs from malformed string
            const urlMatches = project.generated_photos.match(/https:\/\/[^"]+/g)
            if (urlMatches) {
              photos = urlMatches
            }
          }
        } else if (Array.isArray(project.generated_photos)) {
          // If it's already an array, use it
          photos = project.generated_photos
        }

        // Filter for valid URLs
        const validPhotos = photos.filter(
          (photo) => typeof photo === "string" && photo.startsWith("http") && photo.includes("astria.ai"),
        )

        if (validPhotos.length > 0) {
          // Update with PostgreSQL array syntax
          await sql`
            UPDATE projects 
            SET generated_photos = ${validPhotos}
            WHERE id = ${project.id}
          `

          fixedCount++
          results.push({
            projectId: project.id,
            projectName: project.name,
            photosFound: validPhotos.length,
            status: "fixed",
          })

          console.log(`✅ Fixed project ${project.id}: ${validPhotos.length} photos`)
        } else {
          results.push({
            projectId: project.id,
            projectName: project.name,
            photosFound: 0,
            status: "no_photos",
          })
        }
      } catch (projectError) {
        console.error(`❌ Error fixing project ${project.id}:`, projectError)
        results.push({
          projectId: project.id,
          projectName: project.name,
          status: "error",
          error: projectError instanceof Error ? projectError.message : "Unknown error",
        })
      }
    }

    console.log(`✅ Database fix completed: ${fixedCount} projects fixed`)

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} projects`,
      totalProjects: projects.length,
      fixedProjects: fixedCount,
      results,
    })
  } catch (error) {
    console.error("❌ Database fix failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database fix failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
