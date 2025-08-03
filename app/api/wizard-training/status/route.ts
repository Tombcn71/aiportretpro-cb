import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    console.log("🔍 Checking training status for session:", sessionId)

    // Find project by purchase with Stripe session ID
    const result = await sql`
      SELECT p.*, pu.stripe_session_id 
      FROM projects p
      JOIN purchases pu ON p.purchase_id = pu.id
      WHERE pu.stripe_session_id LIKE ${"%" + sessionId + "%"}
      ORDER BY p.created_at DESC
      LIMIT 1
    `

    if (result.length === 0) {
      console.log("❌ No project found for session:", sessionId)
      return NextResponse.json({
        status: "processing",
        progress: 5,
        estimatedTime: 15,
      })
    }

    const project = result[0]
    console.log("📋 Found project:", {
      id: project.id,
      status: project.status,
      tuneId: project.tune_id,
    })

    // Calculate realistic progress
    let progress = 10
    let estimatedTime = 15

    switch (project.status) {
      case "training":
        // Calculate progress based on time elapsed
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
        return NextResponse.json({
          status: "error",
          progress: 0,
          projectId: project.id,
        })
      default:
        progress = 5
        estimatedTime = 15
    }

    return NextResponse.json({
      status: project.status,
      progress: Math.round(progress),
      estimatedTime: Math.round(estimatedTime),
      projectId: project.id,
      tuneId: project.tune_id,
    })
  } catch (error) {
    console.error("❌ Training status error:", error)
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 })
  }
}
