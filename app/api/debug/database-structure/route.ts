import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check purchases table structure
    const purchasesStructure = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'purchases'
      ORDER BY ordinal_position
    `

    // Check credits table structure
    const creditsStructure = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'credits'
      ORDER BY ordinal_position
    `

    // Check users table structure
    const usersStructure = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `

    // Sample data from each table
    const samplePurchases = await sql`SELECT * FROM purchases LIMIT 3`
    const sampleCredits = await sql`SELECT * FROM credits LIMIT 3`
    const sampleUsers = await sql`SELECT * FROM users LIMIT 3`

    return NextResponse.json({
      purchasesStructure,
      creditsStructure,
      usersStructure,
      samplePurchases,
      sampleCredits,
      sampleUsers,
    })
  } catch (error) {
    console.error("Database structure check error:", error)
    return NextResponse.json(
      {
        error: "Database error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
