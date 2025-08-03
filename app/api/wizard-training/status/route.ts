import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Get wizard session status
    const result = await sql`
      SELECT status, created_at, updated_at FROM wizard_sessions 
      WHERE id = ${sessionId} AND user_email = ${session.user.email}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const wizardSession = result[0]

    // Calculate progress based on time elapsed and status
    let progress = 0
    let status = "processing"

    if (wizardSession.status === "paid") {
      const now = new Date()
      const startTime = new Date(wizardSession.updated_at)
      const elapsedMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60)

      if (elapsedMinutes < 1) {
        status = "processing"
        progress = 10
      } else if (elapsedMinutes < 15) {
        status = "training"
        progress = Math.min(90, 10 + (elapsedMinutes / 15) * 80)
      } else {
        status = "completed"
        progress = 100

        // Update status in database
        await sql`
          UPDATE wizard_sessions 
          SET status = 'completed' 
          WHERE id = ${sessionId}
        `
      }
    }

    return NextResponse.json({
      status,
      progress: Math.round(progress),
    })
  } catch (error) {
    console.error("Error getting training status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
