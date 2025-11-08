import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check alle webhook logs
    const allLogs = await sql`
      SELECT 
        id,
        type,
        created_at,
        payload,
        error
      FROM webhook_logs 
      ORDER BY created_at DESC
    `

    // Analyseer de payloads voor image data
    const analysis = allLogs.map((log) => {
      const payload = log.payload
      const imageAnalysis = {
        id: log.id,
        type: log.type,
        created_at: log.created_at,
        hasImages: false,
        imageLocations: [],
        allKeys: payload ? Object.keys(payload) : [],
        promptKeys: payload?.prompt ? Object.keys(payload.prompt) : [],
      }

      if (payload) {
        // Check verschillende locaties voor images
        if (payload.images) {
          imageAnalysis.hasImages = true
          imageAnalysis.imageLocations.push({
            path: "payload.images",
            type: Array.isArray(payload.images) ? "array" : typeof payload.images,
            length: Array.isArray(payload.images) ? payload.images.length : null,
            sample: Array.isArray(payload.images) ? payload.images[0] : payload.images,
          })
        }

        if (payload.prompt?.images) {
          imageAnalysis.hasImages = true
          imageAnalysis.imageLocations.push({
            path: "payload.prompt.images",
            type: Array.isArray(payload.prompt.images) ? "array" : typeof payload.prompt.images,
            length: Array.isArray(payload.prompt.images) ? payload.prompt.images.length : null,
            sample: Array.isArray(payload.prompt.images) ? payload.prompt.images[0] : payload.prompt.images,
          })
        }

        // Check andere mogelijke locaties
        const otherPaths = ["image_urls", "outputs", "results", "prompt.image_urls", "prompt.outputs", "prompt.results"]
        otherPaths.forEach((path) => {
          const value = path.includes(".") ? payload[path.split(".")[0]]?.[path.split(".")[1]] : payload[path]
          if (value) {
            imageAnalysis.imageLocations.push({
              path: `payload.${path}`,
              type: Array.isArray(value) ? "array" : typeof value,
              length: Array.isArray(value) ? value.length : null,
              sample: Array.isArray(value) ? value[0] : value,
            })
          }
        })
      }

      return imageAnalysis
    })

    return NextResponse.json({
      totalLogs: allLogs.length,
      logsWithImages: analysis.filter((a) => a.hasImages).length,
      analysis: analysis,
      samplePayload: allLogs[0]?.payload || null,
    })
  } catch (error) {
    console.error("Error analyzing webhooks:", error)
    return NextResponse.json({ error: "Failed to analyze webhooks", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
