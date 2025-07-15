import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user
    const users = await sql`SELECT id FROM users WHERE email = ${session.user.email}`
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = users[0].id

    // Get all projects with their photos
    const projects = await sql`
      SELECT id, name, status, generated_photos, created_at
      FROM projects 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    // Analyze each project's photos
    const analysis = projects.map((project) => {
      let photoCount = 0
      let photoSample = []
      let parseError = null

      if (project.generated_photos) {
        try {
          let photos = []

          if (typeof project.generated_photos === "string") {
            // Handle JSON string
            if (project.generated_photos.startsWith("[")) {
              photos = JSON.parse(project.generated_photos)
            } else if (project.generated_photos.startsWith("{")) {
              // Handle single object
              const parsed = JSON.parse(project.generated_photos)
              photos = Array.isArray(parsed) ? parsed : [parsed]
            } else {
              // Handle single URL string
              photos = [project.generated_photos]
            }
          } else if (Array.isArray(project.generated_photos)) {
            photos = project.generated_photos
          } else if (typeof project.generated_photos === "object") {
            // Handle object case
            photos = [project.generated_photos]
          }

          // Filter valid URLs only
          photos = photos.filter(
            (photo) =>
              photo &&
              typeof photo === "string" &&
              (photo.includes("astria.ai") || photo.includes("mp.astria.ai")) &&
              photo.startsWith("http"),
          )

          photoCount = photos.length
          photoSample = photos.slice(0, 3)
        } catch (e) {
          parseError = `Parse error: ${e.message}`
          console.error(`Error parsing photos for project ${project.id}:`, e)
        }
      }

      return {
        id: project.id,
        name: project.name,
        status: project.status,
        created_at: project.created_at,
        photoCount,
        photoSample,
        parseError,
        rawPhotosType: typeof project.generated_photos,
        rawPhotosPreview: project.generated_photos
          ? JSON.stringify(project.generated_photos).substring(0, 200) + "..."
          : null,
      }
    })

    const totalPhotos = analysis.reduce((sum, project) => sum + project.photoCount, 0)

    console.log(`📊 Photo check summary:
- Total projects: ${projects.length}
- Projects with photos: ${analysis.filter((p) => p.photoCount > 0).length}
- Projects without photos: ${analysis.filter((p) => p.photoCount === 0).length}
- Total photos found: ${totalPhotos}
- Parse errors: ${analysis.filter((p) => p.parseError).length}
`)

    return NextResponse.json({
      success: true,
      totalProjects: projects.length,
      totalPhotos,
      projects: analysis,
    })
  } catch (error) {
    console.error("Error checking photos:", error)
    return NextResponse.json(
      {
        error: "Failed to check photos",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
