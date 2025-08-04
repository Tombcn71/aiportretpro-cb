import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if credits table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'credits'
      )
    `

    // Get user's credits
    const userCredits = await sql`
      SELECT * FROM credits WHERE user_id = ${user.id}
    `

    // Get all credits records
    const allCredits = await sql`
      SELECT c.*, u.email 
      FROM credits c 
      JOIN users u ON c.user_id = u.id 
      ORDER BY c.created_at DESC
    `

    // Get user's purchases
    const purchases = await sql`
      SELECT * FROM purchases WHERE user_id = ${user.id} ORDER BY created_at DESC
    `

    return NextResponse.json({
      tableExists: tableExists[0].exists,
      userId: user.id,
      userEmail: user.email,
      userCredits: userCredits[0] || null,
      allCredits,
      purchases,
    })
  } catch (error) {
    console.error("Debug credits error:", error)
    return NextResponse.json({ error: "Failed to debug credits" }, { status: 500 })
  }
}
