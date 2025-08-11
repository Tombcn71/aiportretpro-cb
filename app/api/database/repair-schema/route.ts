import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Starting database schema repair...")

    // Add tune_id column if it doesn't exist
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS tune_id VARCHAR(255)
    `
    console.log("✅ Added tune_id column")

    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_projects_tune_id ON projects(tune_id)
    `
    console.log("✅ Created tune_id index")

    // Update project 40 with tune_id from prediction_id
    const updateResult = await sql`
      UPDATE projects 
      SET tune_id = prediction_id::text
      WHERE id = 40 AND tune_id IS NULL
      RETURNING id, name, prediction_id, tune_id
    `
    console.log("✅ Updated project 40:", updateResult)

    // Verify all projects
    const allProjects = await sql`
      SELECT id, name, prediction_id, tune_id, status, 
             CASE 
               WHEN generated_photos IS NOT NULL THEN 'HAS_PHOTOS'
               ELSE 'NO_PHOTOS'
             END as photo_status
      FROM projects 
      ORDER BY id
    `

    return NextResponse.json({
      success: true,
      message: "Database schema repaired successfully!",
      updatedProjects: updateResult,
      allProjects: allProjects,
      changes: ["Added tune_id column", "Created tune_id index", "Updated project 40 with tune_id from prediction_id"],
    })
  } catch (error) {
    console.error("❌ Database repair error:", error)
    return NextResponse.json(
      {
        error: "Database repair failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
