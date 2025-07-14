import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

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

    // Get user ID
    const userResult = await sql`SELECT id FROM users WHERE email = ${session.user.email}`
    if (!userResult.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const userId = userResult[0].id

    // Get the project and verify ownership
    const projectResult = await sql`
      SELECT id, generated_photos, user_id 
      FROM projects 
      WHERE id = ${projectId} AND user_id = ${userId}
    `

    if (!projectResult.length) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    const project = projectResult[0]
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

    // Remove the specific photo
    const updatedPhotos = currentPhotos.filter((photo) => photo !== photoUrl)

    // Update the project with the new photos array
    await sql`
      UPDATE projects 
      SET generated_photos = ${JSON.stringify(updatedPhotos)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId} AND user_id = ${userId}
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
