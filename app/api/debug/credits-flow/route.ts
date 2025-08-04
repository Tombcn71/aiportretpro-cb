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
      SELECT id, email, name, created_at FROM users WHERE email = ${session.user.email}
    `

    if (!userResult[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userResult[0]

    // Get current credits
    const creditsResult = await sql`
      SELECT * FROM credits WHERE user_id = ${user.id}
    `

    // Get recent projects
    const projectsResult = await sql`
      SELECT id, name, status, credits_used, created_at, tune_id
      FROM projects 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get recent purchases
    const purchasesResult = await sql`
      SELECT id, amount, status, stripe_session_id, created_at
      FROM purchases 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 10
    `

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
      },
      credits: creditsResult[0] || { credits: 0, message: "No credits record found" },
      recentProjects: projectsResult,
      recentPurchases: purchasesResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug credits flow error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
