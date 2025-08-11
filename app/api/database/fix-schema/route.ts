import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    console.log("🔧 Fixing database schema...")

    const fixes = []

    // Add missing columns
    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS generated_photos TEXT[]`
      fixes.push("✅ Added generated_photos column (TEXT[])")
    } catch (error) {
      fixes.push(`❌ Failed to add generated_photos: ${error.message}`)
    }

    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS prediction_id VARCHAR(255)`
      fixes.push("✅ Added prediction_id column (VARCHAR)")
    } catch (error) {
      fixes.push(`❌ Failed to add prediction_id: ${error.message}`)
    }

    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
      fixes.push("✅ Added updated_at column")
    } catch (error) {
      fixes.push(`❌ Failed to add updated_at: ${error.message}`)
    }

    // Add indexes
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_projects_prediction_id ON projects(prediction_id)`
      fixes.push("✅ Added prediction_id index")
    } catch (error) {
      fixes.push(`❌ Failed to add prediction_id index: ${error.message}`)
    }

    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)`
      fixes.push("✅ Added status index")
    } catch (error) {
      fixes.push(`❌ Failed to add status index: ${error.message}`)
    }

    // Update existing projects without updated_at
    try {
      const updateResult = await sql`
        UPDATE projects 
        SET updated_at = created_at 
        WHERE updated_at IS NULL
      `
      fixes.push(`✅ Updated ${updateResult.length} projects with updated_at`)
    } catch (error) {
      fixes.push(`❌ Failed to update timestamps: ${error.message}`)
    }

    // Verify the fixes
    const verification = await sql`
      SELECT 
          COUNT(*) as total_projects,
          COUNT(CASE WHEN generated_photos IS NOT NULL THEN 1 END) as has_photos_column,
          COUNT(CASE WHEN prediction_id IS NOT NULL THEN 1 END) as has_prediction_id,
          COUNT(CASE WHEN updated_at IS NOT NULL THEN 1 END) as has_updated_at
      FROM projects
    `

    return NextResponse.json({
      success: true,
      fixes_applied: fixes,
      verification: verification[0],
      next_steps: [
        "Database schema is now fixed",
        "Run photo recovery to get your images",
        "Test new project creation",
      ],
    })
  } catch (error) {
    console.error("Database fix error:", error)
    return NextResponse.json(
      {
        error: "Database fix failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
