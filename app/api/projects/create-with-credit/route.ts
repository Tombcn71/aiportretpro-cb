import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"
import axios from "axios"

const astriaApiKey = process.env.ASTRIA_API_KEY
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    console.log("Creating project with credit...")

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { projectName, gender, uploadedPhotos } = data

    // Validate required fields
    if (!projectName || !gender || !uploadedPhotos || uploadedPhotos.length < 4) {
      return NextResponse.json(
        {
          error: "Missing required fields or insufficient photos",
        },
        { status: 400 },
      )
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check credits
    const creditResult = await sql`
      SELECT credits FROM credits WHERE user_id = ${user.id}
    `

    const currentCredits = creditResult[0]?.credits || 0
    if (currentCredits < 1) {
      return NextResponse.json(
        {
          error: "Insufficient credits. Please purchase credits to continue.",
        },
        { status: 400 },
      )
    }

    // Create project with credits_used = 1
    const result = await sql`
      INSERT INTO projects (user_id, name, gender, outfits, backgrounds, uploaded_photos, status, credits_used)
      VALUES (${user.id}, ${projectName}, ${gender}, ${[]}, ${[]}, ${uploadedPhotos}, 'training', 1)
      RETURNING id
    `
    const projectId = result[0].id

    // Use EXACT same code as working create-with-pack route
    const baseUrl = process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`
    const DOMAIN = "https://api.astria.ai"
    const selectedPackId = "928" // Use pack 928

    const tuneBody = {
      tune: {
        title: `${projectName}_${projectId}`,
        name: gender,
        image_urls: uploadedPhotos,
        callback: `${baseUrl}/api/astria/train-webhook?user_id=${user.id}&model_id=${projectId}&webhook_secret=${appWebhookSecret}`,
        prompt_attributes: {
          callback: `${baseUrl}/api/astria/prompt-webhook?user_id=${user.id}&model_id=${projectId}&webhook_secret=${appWebhookSecret}`,
        },
      },
    }

    console.log(`Creating tune with pack ${selectedPackId}`)

    const response = await axios.post(`${DOMAIN}/p/${selectedPackId}/tunes`, tuneBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${astriaApiKey}`,
      },
    })

    if (response.status !== 201) {
      console.error("Astria error:", response.status, response.data)
      await sql`DELETE FROM projects WHERE id = ${projectId}`
      return NextResponse.json({ message: "Astria API error" }, { status: response.status })
    }

    // Update project with tune ID
    await sql`
      UPDATE projects 
      SET tune_id = ${response.data.id.toString()}, status = 'training'
      WHERE id = ${projectId}
    `

    // Deduct credit
    await sql`
      UPDATE credits 
      SET credits = ${currentCredits - 1}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${user.id}
    `

    console.log(`✅ Credits deducted: ${currentCredits} -> ${currentCredits - 1}`)

    return NextResponse.json({
      projectId: projectId,
      tuneId: response.data.id,
      message: "Project created and generation started",
    })
  } catch (error) {
    console.error("Error creating project with credit:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
