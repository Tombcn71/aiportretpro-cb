import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId
    const body = await req.json()

    console.log("🖼️ Wizard prompt webhook for project:", projectId)
    console.log("📦 Prompt webhook body:", JSON.stringify(body, null, 2))

    // Handle both formats
    const promptData = body.data || body.prompt

    if (!promptData) {
      console.error("❌ Invalid prompt webhook body")
      return NextResponse.json({ error: "Invalid webhook body" }, { status: 400 })
    }

    const promptId = promptData.id
    const images = promptData.images || []

    console.log("📊 Prompt result:", {
      promptId,
      imageCount: images.length,
    })

    if (images.length > 0) {
      // Store images in database
      for (const image of images) {
        await sql`
          INSERT INTO photos (
            project_id,
            prompt_id,
            image_url,
            created_at
          ) VALUES (
            ${projectId},
            ${promptId},
            ${image.url},
            NOW()
          )
        `
      }

      console.log(`✅ Stored ${images.length} images for project ${projectId}`)

      // Check if all prompts are complete
      const [project] = await sql`
        SELECT * FROM projects WHERE id = ${projectId}
      `

      if (project) {
        const [photoCount] = await sql`
          SELECT COUNT(*) as count FROM photos WHERE project_id = ${projectId}
        `

        // If we have enough photos, mark as complete
        if (photoCount.count >= 4) {
          await sql`
            UPDATE projects 
            SET status = 'completed', updated_at = NOW()
            WHERE id = ${projectId}
          `

          console.log("🎉 Project completed with all photos!")
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Prompt webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}
