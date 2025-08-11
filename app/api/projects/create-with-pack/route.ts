import { NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"
import { CreditManager } from "@/lib/credits"

export const dynamic = "force-dynamic"

const astriaApiKey = process.env.ASTRIA_API_KEY
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!")
}

export async function POST(request: Request) {
  const payload = await request.json()
  const { projectName, gender, selectedPackId, uploadedPhotos } = payload

  console.log("Creating project with pack:", {
    projectName,
    gender,
    selectedPackId,
    photoCount: uploadedPhotos?.length,
  })

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (!astriaApiKey) {
    return NextResponse.json(
      { message: "Missing API Key: Add your Astria API Key to generate headshots" },
      { status: 500 },
    )
  }

  if (!uploadedPhotos || uploadedPhotos.length < 4) {
    return NextResponse.json({ message: "Upload at least 4 sample images" }, { status: 500 })
  }

  if (!selectedPackId) {
    return NextResponse.json({ message: "Pack ID is required" }, { status: 400 })
  }

  // Get user from Neon database
  const user = await getUserByEmail(session.user.email)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Check credits using CreditManager - SAME AS USE-CREDITS
  const currentCredits = await CreditManager.getUserCredits(user.id)
  if (currentCredits < 1) {
    return NextResponse.json(
      { message: "Not enough credits, please purchase some credits and try again." },
      { status: 500 },
    )
  }

  // Create a project in database
  let projectId
  try {
    const result = await sql`
      INSERT INTO projects (user_id, name, gender, outfits, backgrounds, uploaded_photos, status, credits_used)
      VALUES (${user.id}, ${projectName}, ${gender}, ${[]}, ${[]}, ${uploadedPhotos}, 'training', 0)
      RETURNING id
    `
    projectId = result[0].id
    console.log(`✅ Project created with ID ${projectId}`)
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`
    const DOMAIN = "https://api.astria.ai"

    // For localhost testing, use ngrok or similar
    const webhookUrl = process.env.NODE_ENV === "development" 
      ? "https://your-ngrok-url.ngrok.io"  // Replace with your ngrok URL
      : baseUrl

    const tuneBody = {
      tune: {
        title: `${projectName}_${projectId}`,
        name: gender,
        image_urls: uploadedPhotos,
        callback: `${webhookUrl}/api/astria/train-webhook?user_id=${user.id}&model_id=${projectId}&webhook_secret=${appWebhookSecret}`,
        prompt_attributes: {
          callback: `${webhookUrl}/api/astria/prompt-webhook?user_id=${user.id}&model_id=${projectId}&webhook_secret=${appWebhookSecret}`,
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

    // Use credit - EXACT SAME AS USE-CREDITS ROUTE
    await CreditManager.useCredit(user.id, projectId)
    console.log(`✅ Credit used successfully for project ${projectId}`)

    return NextResponse.json({
      message: "success",
      projectId: projectId,
      tuneId: response.data.id,
    })
  } catch (error) {
    console.error("Tune creation error:", error)

    // Rollback project
    if (projectId) {
      await sql`DELETE FROM projects WHERE id = ${projectId}`
    }

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        data: error.response?.data,
      })
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}
