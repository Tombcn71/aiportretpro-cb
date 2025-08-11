import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all projects with their photos
    const projects = await sql`
      SELECT 
        p.*,
        u.email as user_email,
        array_length(p.generated_photos, 1) as photo_count
      FROM projects p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `

    const debugInfo = {
      total_projects: projects.length,
      projects: projects.map((project) => ({
        id: project.id,
        name: project.name,
        status: project.status,
        user_email: project.user_email,
        photo_count: project.photo_count || 0,
        has_photos: project.generated_photos && project.generated_photos.length > 0,
        first_photo_preview: project.generated_photos?.[0]?.substring(0, 100) + "..." || null,
        prediction_id: project.prediction_id,
        created_at: project.created_at,
        updated_at: project.updated_at,
      })),
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Error in debug endpoint:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
