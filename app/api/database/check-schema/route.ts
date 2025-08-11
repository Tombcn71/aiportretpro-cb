import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Checking database schema...")

    // Check table structure
    const tableInfo = await sql`
      SELECT 
          table_name,
          column_name,
          data_type,
          is_nullable,
          column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('projects', 'users', 'purchases', 'credits')
      ORDER BY table_name, ordinal_position
    `

    // Check projects table specifically
    const projectsColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'projects'
    `

    // Check current projects data
    const projectsData = await sql`
      SELECT 
          id,
          name,
          status,
          prediction_id,
          generated_photos,
          array_length(generated_photos, 1) as photo_count,
          created_at,
          updated_at
      FROM projects 
      ORDER BY id DESC 
      LIMIT 10
    `

    // Check for missing columns
    const requiredColumns = [
      "id",
      "user_id",
      "name",
      "gender",
      "status",
      "generated_photos",
      "prediction_id",
      "created_at",
      "updated_at",
    ]

    const existingColumns = projectsColumns.map((col) => col.column_name)
    const missingColumns = requiredColumns.filter((col) => !existingColumns.includes(col))

    // Check data types
    const generatedPhotosColumn = projectsColumns.find((col) => col.column_name === "generated_photos")
    const predictionIdColumn = projectsColumns.find((col) => col.column_name === "prediction_id")

    return NextResponse.json({
      database_status: {
        tables_found: [...new Set(tableInfo.map((t) => t.table_name))],
        projects_columns: existingColumns,
        missing_columns: missingColumns,
        generated_photos_type: generatedPhotosColumn?.data_type || "MISSING",
        prediction_id_type: predictionIdColumn?.data_type || "MISSING",
      },
      projects_data: {
        total_projects: projectsData.length,
        projects_with_photos: projectsData.filter((p) => p.photo_count > 0).length,
        projects_with_prediction_id: projectsData.filter((p) => p.prediction_id).length,
        sample_projects: projectsData.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          prediction_id: p.prediction_id,
          photo_count: p.photo_count || 0,
          has_photos_array: !!p.generated_photos,
        })),
      },
      schema_issues: {
        missing_columns: missingColumns,
        wrong_data_types: [
          generatedPhotosColumn?.data_type !== "ARRAY" && "generated_photos should be TEXT[]",
          predictionIdColumn?.data_type !== "character varying" && "prediction_id should be VARCHAR",
        ].filter(Boolean),
      },
      raw_data: {
        table_info: tableInfo,
        projects_columns: projectsColumns,
        sample_project_data: projectsData[0] || null,
      },
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      {
        error: "Database check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
