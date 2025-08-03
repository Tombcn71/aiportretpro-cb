import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    console.log("🔍 Checking training status for session:", sessionId)

    // Find project by Stripe session ID
    const projectResult = await sql`
      SELECT p.*, pu.stripe_session_id 
      FROM projects p
      JOIN purchases pu ON p.purchase_id = pu.id
      WHERE pu.stripe_session_id = ${sessionId}
      ORDER BY p.created_at DESC
      LIMIT 1
    `

    if (projectResult.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projectResult[0]

    console.log("📋 Project status:", {
      id: project.id,
      status: project.status,
      tuneId: project.tune_id,
    })

    // Calculate progress based on status
    let progress = 0
    let estimatedTime = 15

    switch (project.status) {
      case "payment_completed":
        progress = 10
        estimatedTime = 15
        break
      case "training":
        // Simulate progress based on time elapsed
        const createdAt = new Date(project.created_at).getTime()
        const now = Date.now()
        const elapsed = (now - createdAt) / 1000 / 60 // minutes
        progress = Math.min(10 + (elapsed / 15) * 80, 90) // 10% to 90% over 15 minutes
        estimatedTime = Math.max(15 - elapsed, 1)
        break
      case "completed":
        progress = 100
        estimatedTime = 0
        break
      case "failed":
      case "error":
        progress = 0
        estimatedTime = 0
        break
      default:
        progress = 5
        estimatedTime = 15
    }

    return NextResponse.json({
      status: project.status,
      progress: Math.round(progress),
      projectId: project.id,
      estimatedTime: Math.round(estimatedTime),
      tuneId: project.tune_id,
    })
  } catch (error) {
    console.error("❌ Training status error:", error)
    return NextResponse.json({ error: "Failed to get training status" }, { status: 500 })
  }
}
