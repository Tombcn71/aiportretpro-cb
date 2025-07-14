import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 TRAIN WEBHOOK CALLED")
    console.log("Headers:", Object.fromEntries(request.headers.entries()))
    console.log("URL:", request.url)

    const body = await request.json()
    console.log("🔔 Train webhook body:", JSON.stringify(body, null, 2))

    // Handle different webhook formats
    const tuneData = body.data || body
    const tuneId = tuneData.id
    const status = tuneData.status

    if (!tuneId) {
      console.error("❌ No tune ID found in webhook")
      return NextResponse.json({ error: "No tune ID" }, { status: 400 })
    }

    console.log(`🔍 Processing tune ${tuneId} with status: ${status}`)

    // Find project by tune_id
    const projects = await sql`
      SELECT * FROM projects WHERE tune_id = ${tuneId}
    `

    if (projects.length === 0) {
      console.error(`❌ No project found for tune_id: ${tuneId}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]
    console.log(`📁 Found project: ${project.id} - ${project.name}`)

    // Update project status
    await sql`
      UPDATE projects 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${project.id}
    `

    // If training succeeded, fetch all photos
    if (status === "succeeded") {
      console.log(`✅ Training completed for project ${project.id}. Fetching photos...`)

      try {
        const promptsResponse = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
          headers: {
            Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
          },
        })

        if (promptsResponse.ok) {
          const promptsData = await promptsResponse.json()
          console.log(`📸 Found ${promptsData.length} prompts`)

          const allImageUrls: string[] = []

          for (const prompt of promptsData) {
            if (prompt.images && Array.isArray(prompt.images)) {
              for (const image of prompt.images) {
                if (image.url) {
                  allImageUrls.push(image.url)
                }
              }
            }
          }

          console.log(`🖼️ Collected ${allImageUrls.length} total images`)

          if (allImageUrls.length > 0) {
            await sql`
              UPDATE projects 
              SET 
                generated_photos = ${JSON.stringify(allImageUrls)},
                status = 'completed',
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ${project.id}
            `
            console.log(`✅ Updated project ${project.id} with ${allImageUrls.length} photos`)
          }
        }
      } catch (fetchError) {
        console.error("❌ Error fetching photos:", fetchError)
      }
    }

    return NextResponse.json({ success: true, processed: true })
  } catch (error) {
    console.error("❌ Train webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
