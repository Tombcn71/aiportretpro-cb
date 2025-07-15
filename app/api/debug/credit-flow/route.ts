import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user credits
    const creditResult = await sql`
      SELECT * FROM credits WHERE user_id = ${user.id}
    `

    // Get all projects
    const projects = await sql`
      SELECT id, name, status, credits_used, created_at 
      FROM projects 
      WHERE user_id = ${user.id} 
      ORDER BY created_at DESC
    `

    // Calculate totals
    const totalProjects = projects.length
    const completedProjects = projects.filter((p) => p.status === "completed").length
    const totalCreditsUsed = projects.reduce((sum, p) => sum + (p.credits_used || 0), 0)
    const currentCredits = creditResult[0]?.credits || 0

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      credits: {
        current: currentCredits,
        lastUpdated: creditResult[0]?.updated_at,
        totalUsed: totalCreditsUsed,
      },
      projects: {
        total: totalProjects,
        completed: completedProjects,
        list: projects.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          creditsUsed: p.credits_used || 0,
          date: p.created_at,
        })),
      },
      analysis: {
        problemDetected: totalCreditsUsed === 0 && completedProjects > 0,
        availableCredits: currentCredits,
        shouldHaveUsed: completedProjects,
      },
    })
  } catch (error) {
    console.error("Credit flow debug error:", error)
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
}
