import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 LIVE WEBHOOK DEBUG - Checking recent webhook activity")

    // Check recent projects
    const recentProjects = await sql`
      SELECT id, name, status, created_at, updated_at, generated_photos
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    console.log("📊 Recent projects:", recentProjects)

    // Check webhook environment variables
    const webhookConfig = {
      APP_WEBHOOK_SECRET: process.env.APP_WEBHOOK_SECRET ? "SET" : "MISSING",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
      ASTRIA_API_KEY: process.env.ASTRIA_API_KEY ? "SET" : "MISSING",
    }

    console.log("🔧 Webhook config:", webhookConfig)

    // Test webhook URL construction
    const deploymentUrl = process.env.NEXTAUTH_URL
    const baseUrl =
      deploymentUrl?.startsWith("http://") || deploymentUrl?.startsWith("https://")
        ? deploymentUrl
        : `https://${deploymentUrl}`

    const webhookUrls = {
      promptWebhook: `${baseUrl}/api/astria/prompt-webhook`,
      trainWebhook: `${baseUrl}/api/astria/train-webhook`,
    }

    console.log("🌐 Webhook URLs:", webhookUrls)

    return NextResponse.json({
      success: true,
      recentProjects,
      webhookConfig,
      webhookUrls,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Debug error:", error)
    return NextResponse.json({ error: "Debug failed", details: error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("🧪 MANUAL WEBHOOK TEST:", body)

    // Simulate webhook call
    if (body.projectId && body.images) {
      await sql`
        UPDATE projects 
        SET generated_photos = ${body.images}, 
            status = 'completed', 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${body.projectId}
      `

      console.log("✅ Manual webhook test completed")
      return NextResponse.json({ success: true, message: "Project updated manually" })
    }

    return NextResponse.json({ error: "Missing projectId or images" }, { status: 400 })
  } catch (error) {
    console.error("❌ Manual test error:", error)
    return NextResponse.json({ error: "Manual test failed" }, { status: 500 })
  }
}
