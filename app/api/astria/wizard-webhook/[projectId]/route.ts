import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId
    const body = await req.json()

    console.log("🎯 Wizard Astria webhook for project:", projectId)
    console.log("📦 Webhook body:", JSON.stringify(body, null, 2))

    // Handle both formats: body.data and body.tune
    const tuneData = body.data || body.tune

    if (!tuneData) {
      console.error("❌ Invalid webhook body")
      return NextResponse.json({ error: "Invalid webhook body" }, { status: 400 })
    }

    const tuneId = tuneData.id
    const isTrainingComplete = tuneData.trained_at !== null

    console.log("📊 Tune status:", {
      tuneId,
      isTrainingComplete,
      trained_at: tuneData.trained_at,
    })

    // Update project status
    await sql`
      UPDATE projects 
      SET 
        tune_id = ${tuneId},
        status = ${isTrainingComplete ? "trained" : "training"},
        updated_at = NOW()
      WHERE id = ${projectId}
    `

    if (isTrainingComplete) {
      console.log("🎉 Training completed! Starting prompt generation...")

      // Start generating prompts
      await generatePrompts(projectId, tuneId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Wizard webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 500 })
  }
}

async function generatePrompts(projectId: string, tuneId: number) {
  try {
    console.log("🎨 Generating prompts for project:", projectId)

    const prompts = [
      "professional headshot, business attire, clean background",
      "corporate portrait, suit and tie, office setting",
      "executive headshot, confident expression, neutral background",
      "business professional, formal wear, studio lighting",
    ]

    for (const prompt of prompts) {
      const response = await fetch("https://api.astria.ai/tunes/" + tuneId + "/prompts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            text: `${prompt}, ohwx person`,
            callback: `${process.env.NEXTAUTH_URL}/api/astria/wizard-prompt-webhook/${projectId}`,
          },
        }),
      })

      if (!response.ok) {
        console.error("❌ Failed to create prompt:", response.status)
        continue
      }

      const promptData = await response.json()
      console.log("✅ Prompt created:", promptData.id)
    }

    // Update project status
    await sql`
      UPDATE projects 
      SET status = 'generating', updated_at = NOW()
      WHERE id = ${projectId}
    `

    console.log("🎯 All prompts submitted successfully")
  } catch (error) {
    console.error("❌ Error generating prompts:", error)
  }
}
