import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const projectId = Number.parseInt(params.projectId)
    const body = await req.json()

    console.log("🎯 Wizard Astria webhook for project:", projectId)
    console.log("📦 Webhook body:", JSON.stringify(body, null, 2))

    if (!body.data || !body.data.id) {
      console.error("❌ Invalid webhook body")
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const tuneId = body.data.id
    const status = body.data.status

    console.log("🔧 Tune ID:", tuneId, "Status:", status)

    // Import database functions
    const { sql, updateProjectStatus } = await import("@/lib/db")

    if (status === "trained") {
      console.log("✅ Training completed, starting prompts...")

      // Update project status
      await updateProjectStatus(projectId, "generating")

      // Start generating headshots with prompts
      const prompts = [
        "professional headshot, business attire, office background, high quality, sharp focus",
        "professional portrait, suit and tie, corporate setting, professional lighting",
        "business headshot, formal wear, neutral background, professional photography",
        "executive portrait, business casual, office environment, high resolution",
        "professional photo, formal attire, clean background, studio lighting",
        "corporate headshot, business suit, professional setting, sharp details",
        "formal portrait, professional clothing, office backdrop, high quality",
        "business portrait, executive attire, neutral setting, professional grade",
        "professional headshot, formal wear, corporate background, studio quality",
        "executive photo, business attire, professional environment, high definition",
        "corporate portrait, formal suit, office setting, professional lighting",
        "business headshot, professional clothing, clean backdrop, sharp focus",
        "formal headshot, executive wear, neutral background, high quality",
        "professional portrait, business suit, corporate setting, studio grade",
        "executive headshot, formal attire, office environment, professional quality",
        "business portrait, professional wear, clean background, high resolution",
        "corporate headshot, formal clothing, office backdrop, professional lighting",
        "professional photo, business attire, neutral setting, studio quality",
        "executive portrait, formal suit, corporate background, high definition",
        "business headshot, professional clothing, office setting, sharp details",
        "formal portrait, executive attire, clean backdrop, professional grade",
        "corporate photo, business suit, neutral background, studio lighting",
        "professional headshot, formal wear, office environment, high quality",
        "executive portrait, business attire, corporate setting, professional quality",
        "business photo, professional clothing, clean background, high resolution",
        "formal headshot, executive suit, office backdrop, studio grade",
        "corporate portrait, business wear, neutral setting, professional lighting",
        "professional headshot, formal attire, corporate background, sharp focus",
        "executive photo, business suit, office environment, high definition",
        "business portrait, professional clothing, clean backdrop, studio quality",
        "formal portrait, executive wear, neutral background, professional grade",
        "corporate headshot, business attire, office setting, high quality",
        "professional photo, formal suit, corporate backdrop, studio lighting",
        "executive headshot, business clothing, neutral environment, professional quality",
        "business portrait, formal wear, clean background, high resolution",
        "corporate photo, professional attire, office setting, sharp details",
        "formal headshot, executive suit, corporate background, studio grade",
        "professional portrait, business wear, neutral backdrop, professional lighting",
        "executive photo, formal clothing, office environment, high definition",
        "business headshot, professional suit, clean setting, studio quality",
      ]

      // Generate all prompts
      const promptPromises = prompts.map(async (prompt, index) => {
        try {
          const response = await fetch("https://api.astria.ai/prompts", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: {
                text: `<lora:${tuneId}:1.0> ${prompt}`,
                callback_url: `${process.env.NEXTAUTH_URL}/api/astria/wizard-prompt-webhook/${projectId}`,
              },
            }),
          })

          if (response.ok) {
            const data = await response.json()
            console.log(`✅ Prompt ${index + 1} started:`, data.id)
            return data.id
          } else {
            console.error(`❌ Prompt ${index + 1} failed:`, await response.text())
            return null
          }
        } catch (error) {
          console.error(`❌ Error starting prompt ${index + 1}:`, error)
          return null
        }
      })

      const promptIds = await Promise.all(promptPromises)
      const successfulPrompts = promptIds.filter((id) => id !== null)

      console.log(`🎨 Started ${successfulPrompts.length}/${prompts.length} prompts`)

      // Store prompt IDs in project
      await sql`
        UPDATE projects 
        SET prompt_ids = ${JSON.stringify(successfulPrompts)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${projectId}
      `
    } else if (status === "failed") {
      console.error("❌ Training failed")
      await updateProjectStatus(projectId, "failed")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Wizard Astria webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
