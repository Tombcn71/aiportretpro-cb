import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    // Check project status in database
    const result = await sql`
      SELECT status FROM projects 
      WHERE name LIKE '%' || ${sessionId} || '%' 
      ORDER BY created_at DESC 
      LIMIT 1
    `

    const status = result.length > 0 ? result[0].status : "training"

    return NextResponse.json({ status })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ status: "training" })
  }
}
