import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const projects = await sql`
      SELECT id, name, status, created_at, generated_photos, pack_id, user_email
      FROM projects 
      ORDER BY created_at DESC
      LIMIT 20
    `

    const credits = await sql`
      SELECT id, user_email, amount, used, created_at
      FROM credits
      ORDER BY created_at DESC
      LIMIT 10
    `

    return NextResponse.json({
      success: true,
      projects: projects.map((project) => ({
        ...project,
        photoCount: project.generated_photos
          ? (() => {
              try {
                const photos = JSON.parse(project.generated_photos)
                return Array.isArray(photos)
                  ? photos.filter((p) => typeof p === "string" && p.includes("astria.ai")).length
                  : 0
              } catch {
                return 0
              }
            })()
          : 0,
      })),
      credits,
    })
  } catch (error) {
    console.error("Database debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
