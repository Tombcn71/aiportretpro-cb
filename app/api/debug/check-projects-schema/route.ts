import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Check the schema
    const schema = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position
    `

    // Get a sample record to see actual structure
    const sample = await sql`SELECT * FROM projects LIMIT 1`

    return NextResponse.json({
      schema,
      sample: sample[0] || null,
      message: "Projects table schema checked",
    })
  } catch (error) {
    console.error("Error checking schema:", error)
    return NextResponse.json(
      {
        error: "Failed to check schema",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
