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

    // Get wizard session and project status
    const result = await sql`
      SELECT ws.*, p.status as project_status, p.id as project_id
      FROM wizard_sessions ws
      LEFT JOIN projects p ON ws.project_id = p.id
      WHERE ws.id = ${sessionId} AND ws.user_email = ${session.user.email}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const wizardSession = result[0]
    let status = "processing"
    let progress = 0
    let message = "Je betaling wordt verwerkt..."

    if (wizardSession.status === "paid" && wizardSession.project_id) {
      const projectStatus = wizardSession.project_status

      switch (projectStatus) {
        case "paid":
          status = "starting"
          progress = 10
          message = "Training wordt gestart..."
          break
        case "training":
          status = "training"
          progress = 50
          message = "Je AI model wordt getraind..."
          break
        case "generating":
          status = "generating"
          progress = 80
          message = "Headshots worden gegenereerd..."
          break
        case "completed":
          status = "completed"
          progress = 100
          message = "Je headshots zijn klaar!"
          break
        default:
          status = "processing"
          progress = 25
          message = "Bezig met verwerken..."
      }
    }

    return NextResponse.json({
      status,
      progress,
      message,
    })
  } catch (error) {
    console.error("Error getting training status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
