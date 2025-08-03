import { NextResponse } from "next/server"
import axios from "axios"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

const astriaApiKey = process.env.ASTRIA_API_KEY
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!")
}

export async function POST(request: Request) {
  const payload = await request.json()
  const { projectName, gender, uploadedPhotos, userEmail, packId = "928", existingProjectId } = payload

  console.log("Creating Astria training for project:", {
    existingProjectId,
    projectName,
    gender,
    packId,
    photoCount: uploadedPhotos?.length,
    userEmail,
  })

  if (!astriaApiKey) {
    return NextResponse.json(
      { message: "Missing API Key: Add your Astria API Key to generate headshots" },
      { status: 500 },
    )
  }

  if (!uploadedPhotos || uploadedPhotos.length < 3) {
    return NextResponse.json(
      {
        message: "Need at least 3 photos for training",
      },
      { status: 400 },
    )
  }

  if (!existingProjectId) {
    return NextResponse.json(
      {
        message: "Missing project ID",
      },
      { status: 400 },
    )
  }

  // Get the project from database
  let project
  try {
    const projectResult = await sql`
      SELECT * FROM projects WHERE id = ${existingProjectId}
    `

    if (projectResult.length === 0) {
      return NextResponse.json(
        {
          message: "Project not found",
        },
        { status: 404 },
      )
    }

    project = projectResult[0]

    // Verify project status
    if (project.status !== "paid") {
      return NextResponse.json(
        {
          message: "Project is not in paid status",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Project lookup error:", error)
    return NextResponse.json(
      {
        message: "Database error",
      },
      { status: 500 },
    )
  }

  // Get user ID from project or find by email
  let userId = project.user_id

  if (!userId && userEmail) {
    try {
      const userResult = await sql`
        SELECT id FROM users WHERE email = ${userEmail}
      `
      if (userResult.length > 0) {
        userId = userResult[0].id

        // Update project with user ID
        await sql`
          UPDATE projects 
          SET user_id = ${userId}, updated_at = NOW()
          WHERE id = ${existingProjectId}
        `
      }
    } catch (error) {
      console.error("User lookup error:", error)
    }
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`
    const DOMAIN = "https://api.astria.ai"

    // Parse uploaded photos if they're stored as JSON with metadata
    let photoUrls = uploadedPhotos
    if (typeof uploadedPhotos === "string") {
      photoUrls = JSON.parse(uploadedPhotos)
    }

    // Extract just the URLs if photos are stored with metadata
    if (Array.isArray(photoUrls) && photoUrls[0] && typeof photoUrls[0] === "object") {
      photoUrls = photoUrls.map((photo) => photo.url || photo)
    }

    console.log("Photo URLs for training:", photoUrls)

    // Create Astria tune
    const tuneBody = {
      tune: {
        title: `${projectName}_${existingProjectId}`,
        name: gender,
        image_urls: photoUrls,
        callback: `${baseUrl}/api/astria/train-webhook?user_id=${userId || "guest"}&model_id=${existingProjectId}&webhook_secret=${appWebhookSecret}`,
        prompt_attributes: {
          callback: `${baseUrl}/api/astria/prompt-webhook?user_id=${userId || "guest"}&model_id=${existingProjectId}&webhook_secret=${appWebhookSecret}`,
        },
      },
    }

    console.log(`Creating tune with pack ${packId}`)
    const response = await axios.post(`${DOMAIN}/p/${packId}/tunes`, tuneBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${astriaApiKey}`,
      },
    })

    if (response.status !== 201) {
      console.error("Astria error:", response.status, response.data)

      // Update project status to error
      await sql`
        UPDATE projects 
        SET status = 'error', updated_at = NOW()
        WHERE id = ${existingProjectId}
      `

      return NextResponse.json(
        {
          message: "Astria API error",
          details: response.data,
        },
        { status: response.status },
      )
    }

    // Update project with tune ID and status
    await sql`
      UPDATE projects 
      SET 
        tune_id = ${response.data.id.toString()},
        status = 'training',
        user_id = ${userId},
        updated_at = NOW()
      WHERE id = ${existingProjectId}
    `

    console.log(`✅ Training started for project ${existingProjectId}, tune ID: ${response.data.id}`)

    return NextResponse.json({
      message: "Training started successfully",
      projectId: existingProjectId,
      tuneId: response.data.id,
      status: "training",
    })
  } catch (error) {
    console.error("Tune creation error:", error)
    // Update project status to error
    try {
      await sql`
        UPDATE projects 
        SET status = 'error', updated_at = NOW()
        WHERE id = ${existingProjectId}
      `
    } catch (dbError) {
      console.error("Failed to update project status:", dbError)
    }

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        data: error.response?.data,
      })
    }

    return NextResponse.json(
      {
        message: "Failed to start training",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
