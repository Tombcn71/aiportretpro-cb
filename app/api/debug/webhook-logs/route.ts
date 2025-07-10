import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const purchases = await sql`
      SELECT 
        p.id,
        p.user_id,
        p.stripe_session_id,
        p.status,
        p.created_at,
        u.email,
        c.credits
      FROM purchases p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN credits c ON p.user_id = c.user_id
      ORDER BY p.created_at DESC
      LIMIT 10
    `

    return NextResponse.json({ purchases })
  } catch (error) {
    console.error("Error fetching webhook logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
