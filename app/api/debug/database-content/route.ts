import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await sql`
      SELECT id, name, status, created_at, generated_photos
      FROM projects 
      WHERE user_email = ${session.user.email}
      ORDER BY created_at DESC
    `

    const projectsWithAnalysis = projects.map((project: any) => {
      const photoAnalysis = {
        raw: project.generated_photos,
        type: typeof project.generated_photos,
        parsed: null,
        validCount: 0,
        validPhotos: [],
      }

      try {
        if (project.generated_photos) {
          if (typeof project.generated_photos === "string") {
            if (project.generated_photos.startsWith("[")) {
              photoAnalysis.parsed = JSON.parse(project.generated_photos)
            } else {
              photoAnalysis.parsed = [project.generated_photos]
            }
          } else if (Array.isArray(project.generated_photos)) {
            photoAnalysis.parsed = project.generated_photos
          }

          if (Array.isArray(photoAnalysis.parsed)) {
            photoAnalysis.validPhotos = photoAnalysis.parsed.filter(
              (photo: any) =>
                photo &&
                typeof photo === "string" &&
                photo.length > 30 &&
                (photo.includes("astria.ai") || photo.includes("mp.astria.ai")) &&
                !photo.includes("placeholder"),
            )
            photoAnalysis.validCount = photoAnalysis.validPhotos.length
          }
        }
      } catch (e) {
        photoAnalysis.parsed = "PARSE_ERROR"
      }

      return {
        ...project,
        photoAnalysis,
      }
    })

    return NextResponse.json(projectsWithAnalysis)
  } catch (error) {
    console.error("Database debug error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
