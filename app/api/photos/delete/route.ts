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

    const { photoUrl } = await request.json()

    if (!photoUrl) {
      return NextResponse.json({ error: "Photo URL is required" }, { status: 400 })
    }

    // Find all projects for this user that contain this photo
    const projects = await sql`
      SELECT id, generated_photos 
      FROM projects 
      WHERE user_email = ${session.user.email}
      AND generated_photos IS NOT NULL
    `

    // Update each project to remove the photo
    for (const project of projects) {
      if (project.generated_photos && Array.isArray(project.generated_photos)) {
        const updatedPhotos = project.generated_photos.filter((url: string) => url !== photoUrl)

        await sql`
          UPDATE projects 
          SET generated_photos = ${JSON.stringify(updatedPhotos)}
          WHERE id = ${project.id}
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
