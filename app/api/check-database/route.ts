import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("🔍 Checking database connection and data...")

    // Test basic connection
    const connectionTest = await sql`SELECT NOW() as current_time`
    console.log("✅ Database connection successful:", connectionTest[0])

    // Check projects table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position
    `
    console.log("📋 Projects table structure:", tableInfo)

    // Check projects data with JSON string parsing
    const projectsData = await sql`
      SELECT 
        id, 
        name, 
        status,
        generated_photos,
        CASE 
          WHEN generated_photos IS NULL THEN 0
          WHEN generated_photos = '' THEN 0
          WHEN generated_photos = '[]' THEN 0
          ELSE (
            CASE 
              WHEN generated_photos::text ~ '^\[.*\]$' THEN 
                (SELECT array_length(array(SELECT json_array_elements_text(generated_photos::json)), 1))
              ELSE 0
            END
          )
        END as photo_count,
        created_at,
        updated_at,
        prediction_id
      FROM projects 
      ORDER BY id DESC 
      LIMIT 10
    `
    console.log("📊 Recent projects:", projectsData)

    // Count total projects and photos
    const stats = await sql`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN generated_photos IS NOT NULL AND generated_photos != '' AND generated_photos != '[]' THEN 1 END) as projects_with_photos,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_projects,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_projects
      FROM projects
    `
    console.log("📈 Database stats:", stats[0])

    // Sample a project with photos to show the format
    const sampleWithPhotos = await sql`
      SELECT 
        id, 
        name, 
        generated_photos,
        LENGTH(generated_photos) as json_length
      FROM projects 
      WHERE generated_photos IS NOT NULL 
        AND generated_photos != '' 
        AND generated_photos != '[]'
      LIMIT 1
    `

    return NextResponse.json({
      success: true,
      connection: connectionTest[0],
      tableStructure: tableInfo,
      recentProjects: projectsData,
      stats: stats[0],
      sampleWithPhotos: sampleWithPhotos[0] || null,
      message: "Database check completed successfully",
    })
  } catch (error) {
    console.error("❌ Database check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Database check failed",
      },
      { status: 500 },
    )
  }
}
