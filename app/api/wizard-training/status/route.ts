import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")
    const stripeSessionId = searchParams.get("stripeSessionId")

    if (!sessionId && !stripeSessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    console.log("🔍 Checking training status for:", { sessionId, stripeSessionId })

    // Find project by stripe session ID or wizard session ID
    let project
    if (stripeSessionId) {
      const purchaseResult = await sql`
        SELECT p.*, pr.* FROM purchases p
        JOIN projects pr ON pr.purchase_id = p.id
        WHERE p.stripe_session_id = ${stripeSessionId}
        ORDER BY pr.created_at DESC
        LIMIT 1
      `
      project = purchaseResult[0]
    } else {
      // Fallback: find by wizard session (if stored in metadata)
      const projectResult = await sql`
        SELECT * FROM projects 
        WHERE name LIKE ${"%" + sessionId + "%"}
        ORDER BY created_at DESC
        LIMIT 1
      `
      project = projectResult[0]
    }

    if (!project) {
      return NextResponse.json({
        status: "processing",
        progress: 5,
        message: "Project wordt aangemaakt...",
      })
    }

    console.log("📊 Project status:", project.status)

    // Calculate progress based on status
    let progress = 0
    let status = project.status

    switch (project.status) {
      case "payment_completed":
      case "training":
        progress = 25
        status = "training"
        break
      case "completed":
        progress = 100
        status = "completed"
        break
      case "failed":
        progress = 0
        status = "failed"
        break
      default:
        progress = 10
        status = "processing"
    }

    // If we have a tune_id, we can check Astria status
    if (project.tune_id && status === "training") {
      try {
        const ASTRIA_API_URL = process.env.ASTRIA_API_URL || "https://api.astria.ai"
        const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY

        if (ASTRIA_API_KEY) {
          const astriaResponse = await fetch(`${ASTRIA_API_URL}/tunes/${project.tune_id}`, {
            headers: {
              Authorization: `Bearer ${ASTRIA_API_KEY}`,
            },
          })

          if (astriaResponse.ok) {
            const astriaData = await astriaResponse.json()
            console.log("🎯 Astria status:", astriaData.status)

            switch (astriaData.status) {
              case "training":
                progress = Math.min(50 + (astriaData.progress || 0) * 0.4, 90)
                break
              case "trained":
                progress = 95
                break
              case "failed":
                status = "failed"
                progress = 0
                break
            }
          }
        }
      } catch (astriaError) {
        console.error("⚠️ Astria status check failed:", astriaError)
      }
    }

    return NextResponse.json({
      status,
      progress,
      projectId: project.id,
      tuneId: project.tune_id,
      message: getStatusMessage(status, progress),
    })
  } catch (error) {
    console.error("❌ Status check error:", error)
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
  }
}

function getStatusMessage(status: string, progress: number): string {
  switch (status) {
    case "processing":
      return "Betaling verwerken..."
    case "training":
      if (progress < 30) return "AI model opstarten..."
      if (progress < 60) return "Foto's analyseren..."
      if (progress < 90) return "Portretfoto's genereren..."
      return "Laatste details afwerken..."
    case "completed":
      return "Training voltooid!"
    case "failed":
      return "Training mislukt"
    default:
      return "Bezig..."
  }
}
