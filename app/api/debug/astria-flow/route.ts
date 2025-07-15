import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get environment info
    const webhookSecret = process.env.APP_WEBHOOK_SECRET ? "✅ Present" : "❌ Missing"
    const nextAuthUrl = process.env.NEXTAUTH_URL || "Not set"

    // Get recent webhook logs
    const webhookLogs = await sql`
      SELECT 
        id,
        type,
        payload,
        error,
        created_at
      FROM webhook_logs 
      WHERE type IN ('prompt_webhook', 'train_webhook', 'prompt_webhook_error')
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Transform webhook logs for display
    const transformedLogs = webhookLogs.map((log: any) => {
      let payload = null
      let projectId = null
      let processed = false

      try {
        payload = typeof log.payload === "string" ? JSON.parse(log.payload) : log.payload

        // Try to extract project ID from various sources
        if (payload.model_id) {
          projectId = payload.model_id
        } else if (payload.tune_id) {
          projectId = payload.tune_id
        } else if (payload.id) {
          projectId = payload.id
        } else if (payload.prompt && payload.prompt.tune_id) {
          projectId = payload.prompt.tune_id
        }

        // Determine if processed successfully
        processed =
          !log.error &&
          payload &&
          (payload.status === "succeeded" ||
            payload.status === "completed" ||
            payload.status === "finished" ||
            (payload.prompt && payload.prompt.images && payload.prompt.images.length > 0))
      } catch (e) {
        console.warn("Could not parse webhook payload:", e)
      }

      return {
        id: log.id,
        project_id: projectId || "Unknown",
        type: log.type.replace("_webhook", ""),
        method: "POST",
        processed,
        created_at: log.created_at,
        body: payload,
        error: log.error,
      }
    })

    // Get recent projects with photo counts
    const projects = await sql`
      SELECT 
        id,
        name,
        status,
        tune_id,
        generated_photos,
        created_at,
        CASE 
          WHEN generated_photos IS NULL THEN 0
          WHEN generated_photos = 'null' THEN 0
          WHEN generated_photos = '[]' THEN 0
          ELSE (
            SELECT array_length(
              CASE 
                WHEN generated_photos::text LIKE '[%' THEN generated_photos::json
                ELSE '[]'::json
              END, 1
            )
          )
        END as photo_count
      FROM projects 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    return NextResponse.json({
      webhookSecret:
        webhookSecret + (process.env.APP_WEBHOOK_SECRET ? ` (${process.env.APP_WEBHOOK_SECRET.length} chars)` : ""),
      nextAuthUrl,
      webhookLogs: transformedLogs,
      projects: projects.map((p: any) => ({
        ...p,
        photo_count: p.photo_count || 0,
      })),
    })
  } catch (error) {
    console.error("Debug astria flow error:", error)
    return NextResponse.json({ error: "Failed to fetch debug data", details: error.message }, { status: 500 })
  }
}
