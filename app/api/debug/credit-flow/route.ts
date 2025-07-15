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
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult[0].id

    // Check credits table
    const creditsResult = await sql`
      SELECT * FROM credits WHERE user_id = ${userId}
    `

    // Check projects and their credit usage
    const projectsResult = await sql`
      SELECT id, name, status, credits_used, created_at FROM projects 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `

    // Check recent Stripe payments (if any)
    const paymentsResult = await sql`
      SELECT * FROM users WHERE email = ${session.user.email}
    `

    return NextResponse.json({
      user: {
        id: userId,
        email: session.user.email,
      },
      credits: creditsResult[0] || { message: "No credits record found" },
      projects: projectsResult.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        credits_used: p.credits_used,
        created_at: p.created_at,
      })),
      analysis: {
        totalProjects: projectsResult.length,
        completedProjects: projectsResult.filter((p) => p.status === "completed").length,
        creditsUsedInProjects: projectsResult.reduce((sum, p) => sum + (p.credits_used || 0), 0),
        currentCredits: creditsResult[0]?.credits || 0,
      },
    })
  } catch (error) {
    console.error("Credit flow debug error:", error)
    return NextResponse.json({ error: "Debug failed", details: error.message }, { status: 500 })
  }
}
