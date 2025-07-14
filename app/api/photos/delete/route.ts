import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, getProjectById, sql } from "@/lib/db"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { photoUrl, projectId } = await request.json()

    if (!photoUrl || !projectId) {
      return NextResponse.json({ error: "Photo URL and project ID are required" }, { status: 400 })
    }

    // Get the project and verify ownership
    const project = await getProjectById(Number(projectId))
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Parse current photos
    let currentPhotos: string[] = []
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
        return NextResponse.json({ error: "Error parsing photos" }, { status: 500 })
      }
    }

    // Remove the photo from the array
    const updatedPhotos = currentPhotos.filter((photo) => photo !== photoUrl)

    // Update the database
    await sql`
      UPDATE projects 
      SET generated_photos = ${JSON.stringify(updatedPhotos)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
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
