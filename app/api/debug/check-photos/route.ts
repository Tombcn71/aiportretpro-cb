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
            if (project.generated_photos.startsWith("[")) {
              photos = JSON.parse(project.generated_photos)
            } else {
              photos = [project.generated_photos]
            }
          } else if (Array.isArray(project.generated_photos)) {
            photos = project.generated_photos
          }

          photoCount = photos.length
          photoSample = photos.slice(0, 3) // First 3 photos as sample
        } catch (e) {
          parseError = e.message
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
