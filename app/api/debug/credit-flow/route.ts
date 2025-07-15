import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user credits
    const creditResult = await sql`
      SELECT credits, updated_at FROM credits WHERE user_id = ${user.id}
    `

    // Get all user projects
    const projects = await sql`
      SELECT id, name, status, credits_used, created_at 
      FROM projects 
      WHERE user_id = ${user.id} 
      ORDER BY created_at DESC
    `

    const currentCredits = creditResult[0]?.credits || 0
    const totalProjects = projects.length
    const completedProjects = projects.filter((p) => p.status === "completed").length
    const creditsUsedInProjects = projects.reduce((sum, p) => sum + (p.credits_used || 0), 0)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      credits: {
        current: currentCredits,
        lastUpdated: creditResult[0]?.updated_at,
      },
      projects: {
        total: totalProjects,
        completed: completedProjects,
        creditsUsed: creditsUsedInProjects,
        available: currentCredits,
      },
      analysis: {
        problemDetected: creditsUsedInProjects === 0 && completedProjects > 0,
        message:
          creditsUsedInProjects === 0 && completedProjects > 0
            ? "❌ Credits worden niet afgetrokken bij projecten"
            : "✅ Credits lijken correct te worden afgetrokken van projecten.",
      },
      recentProjects: projects.slice(0, 20).map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        creditsUsed: p.credits_used || 0,
        date: new Date(p.created_at).toLocaleDateString("nl-NL"),
      })),
    })
  } catch (error) {
    console.error("Credit flow debug error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
