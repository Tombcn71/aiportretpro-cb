import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user
    const userResult = await sql`
      SELECT id, email FROM users WHERE email = ${session.user.email}
    `

    if (!userResult[0]) {
      return NextResponse.json({ error: "User not found" })
    }

    const userId = userResult[0].id

    // Check credits table structure and data
    const creditsResult = await sql`
      SELECT * FROM credits WHERE user_id = ${userId}
    `

    // Check recent purchases
    const purchasesResult = await sql`
      SELECT * FROM purchases WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 5
    `

    return NextResponse.json({
      user: userResult[0],
      credits: creditsResult,
      recentPurchases: purchasesResult,
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: error.message })
  }
}
