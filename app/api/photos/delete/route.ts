import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { photoUrl, projectId } = await request.json()

    // Get user_id from users table
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult[0].id

    // Get current project
    const projectResult = await sql`
      SELECT generated_photos FROM projects 
      WHERE id = ${projectId} AND user_id = ${userId}
    `

    if (projectResult.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const currentPhotos = projectResult[0].generated_photos || []

    // Remove the photo from the array
    const updatedPhotos = currentPhotos.filter((photo: string) => photo !== photoUrl)

    // Update the project with the new array
    await sql`
      UPDATE projects 
      SET generated_photos = ${updatedPhotos}
      WHERE id = ${projectId} AND user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}
