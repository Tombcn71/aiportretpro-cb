import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get webhook logs to see what Astria is sending
    const webhookLogs = await sql`
      SELECT * FROM webhook_logs 
      WHERE type = 'prompt_webhook'
      ORDER BY created_at DESC 
      LIMIT 20
    `

    // Get projects with tune_ids
    const projects = await sql`
      SELECT id, name, tune_id, status, generated_photos, created_at
      FROM projects 
      WHERE tune_id IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 10
    `

    return NextResponse.json({
      success: true,
      webhookLogs: webhookLogs.map((log) => ({
        id: log.id,
        created_at: log.created_at,
        payload: typeof log.payload === "string" ? JSON.parse(log.payload) : log.payload,
        error: log.error,
      })),
      projects: projects.map((p) => ({
        id: p.id,
        name: p.name,
        tune_id: p.tune_id,
        status: p.status,
        has_photos: !!p.generated_photos && p.generated_photos !== "null" && p.generated_photos !== "[]",
        photo_count: p.generated_photos
          ? typeof p.generated_photos === "string"
            ? JSON.parse(p.generated_photos).length
            : p.generated_photos.length
          : 0,
        created_at: p.created_at,
      })),
    })
  } catch (error) {
    console.error("Error fetching Astria responses:", error)
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 })
  }
}
