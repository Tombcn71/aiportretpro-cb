import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check for projects that have been "training" for more than 30 minutes
    const stuckProjects = await sql`
      SELECT * FROM projects 
      WHERE user_id = ${user.id} 
      AND status IN ('training', 'processing')
      AND created_at < NOW() - INTERVAL '30 minutes'
    `

    console.log(`Found ${stuckProjects.length} potentially stuck projects`)

    // For now, just return the status - we can add logic to check Astria API later
    return NextResponse.json({
      message: "Status refresh completed",
      stuck_projects: stuckProjects.length,
      projects: stuckProjects.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        created_at: p.created_at,
      })),
    })
  } catch (error) {
    console.error("Error refreshing project status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
