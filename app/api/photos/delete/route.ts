import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoUrl, projectId } = await request.json()

    if (!photoUrl || !projectId) {
      return NextResponse.json({ error: "Missing photoUrl or projectId" }, { status: 400 })
    }

    // Get the project to verify ownership
    const projects = await sql`
      SELECT * FROM projects 
      WHERE id = ${projectId} AND user_id = (
        SELECT id FROM users WHERE email = ${session.user.email}
      )
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 })
    }

    const project = projects[0]
    let currentPhotos: string[] = []

    // Parse current photos
    if (project.generated_photos) {
      try {
        if (typeof project.generated_photos === "string") {
          if (project.generated_photos.startsWith("[")) {
            currentPhotos = JSON.parse(project.generated_photos)
          } else {
            currentPhotos = [project.generated_photos]
          }
        } else if (Array.isArray(project.generated_photos)) {
          currentPhotos = project.generated_photos
        }
      } catch (e) {
        console.error("Error parsing photos:", e)
        currentPhotos = []
      }
    }

    // Remove the photo from the array
    const updatedPhotos = currentPhotos.filter((photo) => photo !== photoUrl)

    // Update the database
    await sql`
      UPDATE projects 
      SET generated_photos = ${JSON.stringify(updatedPhotos)}
      WHERE id = ${projectId} AND user_id = (
        SELECT id FROM users WHERE email = ${session.user.email}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully",
      remainingPhotos: updatedPhotos.length,
    })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
