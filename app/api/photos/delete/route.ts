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

    // First get the user_id from the users table
    const users = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = users[0].id

    // Get the project to verify ownership
    const projects = await sql`
      SELECT * FROM projects 
      WHERE id = ${projectId} AND user_id = ${userId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 })
    }

    const project = projects[0]
    let currentPhotos: string[] = []

    // Parse current photos - handle PostgreSQL ARRAY type
    if (project.generated_photos) {
      if (Array.isArray(project.generated_photos)) {
        currentPhotos = project.generated_photos.filter(Boolean)
      }
    }

    // Remove the photo from the array
    const updatedPhotos = currentPhotos.filter((photo) => photo !== photoUrl)

    // Update the database with PostgreSQL array syntax
    await sql`
      UPDATE projects 
      SET generated_photos = ${updatedPhotos}
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
