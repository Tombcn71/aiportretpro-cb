import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("🔍 Checking database connection and schema...")

    // Test basic connection
    const connectionTest = await sql`SELECT NOW() as current_time`
    console.log("✅ Database connection successful:", connectionTest[0])

    // Check if projects table exists and get structure
    const tableCheck = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `

    if (tableCheck.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Projects table does not exist",
      })
    }

    console.log("📋 Projects table structure:", tableCheck)

    // Check for projects with potential array issues
    const projectsWithArrays = await sql`
      SELECT 
        id, 
        name,
        CASE 
          WHEN generated_photos IS NULL THEN 'null'
          WHEN generated_photos::text = '[]' THEN 'empty_array'
          WHEN generated_photos::text = '"[]"' THEN 'malformed_string'
          ELSE 'has_data'
        END as photo_status,
        generated_photos::text as raw_photos
      FROM projects 
      WHERE generated_photos IS NOT NULL
      LIMIT 10
    `

    console.log("📸 Projects with photo data:", projectsWithArrays)

    // Count projects by status
    const statusCounts = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM projects 
      GROUP BY status
    `

    console.log("📊 Project status counts:", statusCounts)

    return NextResponse.json({
      success: true,
      connection: connectionTest[0],
      tableStructure: tableCheck,
      sampleProjects: projectsWithArrays,
      statusCounts: statusCounts,
      message: "Database check completed successfully",
    })
  } catch (error) {
    console.error("❌ Database check error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown database error",
        details: error,
      },
      { status: 500 },
    )
  }
}
