import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get all projects with their photo data
    const projects = await sql`
      SELECT 
        id,
        name,
        status,
        created_at,
        generated_photos,
        LENGTH(generated_photos::text) as photo_data_length
      FROM projects 
      ORDER BY created_at DESC
    `

    // Analyze each project
    const analysis = projects.map((project: any) => {
      const photoAnalysis = {
        raw: project.generated_photos,
        type: typeof project.generated_photos,
        length: project.photo_data_length,
        parsed: null as any,
        validCount: 0,
        isValidProject: false,
      }

      // Try to parse the photos
      if (project.generated_photos) {
        try {
          let photos: any[] = []

          if (typeof project.generated_photos === "string") {
            if (project.generated_photos.startsWith("[")) {
              photos = JSON.parse(project.generated_photos)
            } else {
              photos = [project.generated_photos]
            }
          } else if (Array.isArray(project.generated_photos)) {
            photos = project.generated_photos
          }

          photoAnalysis.parsed = photos

          // Count valid Astria photos
          const validPhotos = photos.filter((photo: any) => {
            if (!photo || typeof photo !== "string") return false
            if (photo.length < 30) return false
            if (!photo.startsWith("http")) return false
            if (!photo.includes("astria.ai") && !photo.includes("mp.astria.ai")) return false
            if (photo.includes("placeholder")) return false
            if (photo.includes("example.com")) return false
            return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(photo)
          })

          photoAnalysis.validCount = validPhotos.length
          photoAnalysis.isValidProject = validPhotos.length > 0
        } catch (e) {
          photoAnalysis.parsed = `PARSE ERROR: ${e}`
        }
      }

      return {
        id: project.id,
        name: project.name,
        status: project.status,
        created_at: project.created_at,
        photoAnalysis,
      }
    })

    const summary = {
      totalProjects: projects.length,
      projectsWithValidPhotos: analysis.filter((p) => p.photoAnalysis.isValidProject).length,
      projectsWithNoPhotos: analysis.filter((p) => !p.photoAnalysis.raw).length,
      projectsWithInvalidPhotos: analysis.filter((p) => p.photoAnalysis.raw && !p.photoAnalysis.isValidProject).length,
      totalValidPhotos: analysis.reduce((sum, p) => sum + p.photoAnalysis.validCount, 0),
    }

    return NextResponse.json({
      summary,
      projects: analysis,
    })
  } catch (error) {
    console.error("Database debug error:", error)
    return NextResponse.json({ error: "Failed to analyze database" }, { status: 500 })
  }
}
