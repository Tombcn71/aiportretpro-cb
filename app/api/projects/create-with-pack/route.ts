import { NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"

export const dynamic = "force-dynamic"

const astriaApiKey = process.env.ASTRIA_API_KEY
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true"

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

  // Check credits if Stripe is configured (using Neon database)
  let userCredits = 0
  if (stripeIsConfigured) {
    try {
      const creditResult = await sql`
        SELECT credits FROM credits WHERE user_id = ${user.id}
      `

      if (creditResult.length === 0) {
        // Create credits for user
        await sql`
          INSERT INTO credits (user_id, credits) VALUES (${user.id}, 0)
        `
        return NextResponse.json(
          { message: "Not enough credits, please purchase some credits and try again." },
          { status: 500 },
        )
      } else if (creditResult[0].credits < 1) {
        return NextResponse.json(
          { message: "Not enough credits, please purchase some credits and try again." },
          { status: 500 },
        )
      } else {
        userCredits = creditResult[0].credits
      }
    } catch (error) {
      console.error("Credit check error:", error)
      return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
    }
  }

  // Create a project in Neon database
  let projectId
  try {
    const result = await sql`
      INSERT INTO projects (user_id, name, gender, outfits, backgrounds, uploaded_photos, status)
      VALUES (${user.id}, ${projectName}, ${gender}, ${[]}, ${[]}, ${uploadedPhotos}, 'training')
      RETURNING id
    `
    projectId = result[0].id
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }

  try {
    const baseUrl = process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`

    const trainWebhook = `${baseUrl}/api/astria/train-webhook`
    const trainWebhookWithParams = `${trainWebhook}?user_id=${user.id}&model_id=${projectId}&webhook_secret=${appWebhookSecret}`

    const promptWebhook = `${baseUrl}/api/astria/prompt-webhook`
    const promptWebhookWithParams = `${promptWebhook}?user_id=${user.id}&model_id=${projectId}&webhook_secret=${appWebhookSecret}`

    const DOMAIN = "https://api.astria.ai"

    // Create tune using Astria API format based on documentation
    const tuneBody = {
      tune: {
        title: `${projectName}_${projectId}_${Date.now()}`, // UUID-like identifier for idempotency
        name: gender, // Class name (man, woman, etc.)
        image_urls: uploadedPhotos, // Array of training images
        callback: trainWebhookWithParams, // Webhook for training completion
        branch: "sdxl1", // Use SDXL branch
        token: "ohwx", // Default token for SDXL
        face_crop: true, // Enable face detection and cropping
        training_face_correct: true, // Enhance low quality images
        auto_extend: false, // Don't auto-extend when expires
        prompts_attributes: [
          {
            text: `ohwx ${gender}, professional headshot, high quality, studio lighting`,
            num_images: 4,
            callback: promptWebhookWithParams,
          },
          {
            text: `ohwx ${gender}, business portrait, corporate style, clean background`,
            num_images: 4,
            callback: promptWebhookWithParams,
          },
          {
            text: `ohwx ${gender}, casual portrait, natural lighting, friendly expression`,
            num_images: 4,
            callback: promptWebhookWithParams,
          },
          {
            text: `ohwx ${gender}, linkedin profile photo, professional attire, confident pose`,
            num_images: 4,
            callback: promptWebhookWithParams,
          },
        ],
      },
    }

    console.log(`🎯 CREATING TUNE WITH ASTRIA:`)
    console.log(`URL: ${DOMAIN}/tunes`)
    console.log(`Body:`, JSON.stringify(tuneBody, null, 2))
    console.log(`Train webhook: ${trainWebhookWithParams}`)
    console.log(`Prompt webhook: ${promptWebhookWithParams}`)

    const response = await axios.post(`${DOMAIN}/tunes`, tuneBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${astriaApiKey}`,
      },
    })

    const { status } = response

    if (status !== 201) {
      console.error({ status, data: response.data })

      // Rollback: Delete the created project if something goes wrong
      await sql`DELETE FROM projects WHERE id = ${projectId}`

      if (status === 400) {
        return NextResponse.json({ message: "Invalid request - check parameters" }, { status })
      }
      if (status === 402) {
        return NextResponse.json({ message: "Training models is only available on paid plans." }, { status })
      }
      if (status === 404) {
        return NextResponse.json({ message: "API endpoint not found" }, { status })
      }
    }

    console.log("✅ Tune creation started successfully!")
    console.log("Astria response:", response.data)

    // Update project with Astria tune ID
    await sql`
      UPDATE projects 
      SET tune_id = ${response.data.id.toString()}, status = 'training'
      WHERE id = ${projectId}
    `

    // Deduct credits if configured
    if (stripeIsConfigured && userCredits > 0) {
      const subtractedCredits = userCredits - 1
      await sql`
        UPDATE credits 
        SET credits = ${subtractedCredits}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user.id}
      `
      console.log(`Credits deducted: ${userCredits} -> ${subtractedCredits}`)
    }

    return NextResponse.json(
      {
        message: "success",
        projectId: projectId,
        tuneId: response.data.id,
      },
      { status: 200 },
    )
  } catch (e) {
    console.error("Tune creation error:", e)

    // Rollback: Delete the created project if something goes wrong
    if (projectId) {
      await sql`DELETE FROM projects WHERE id = ${projectId}`
    }

    if (axios.isAxiosError(e)) {
      console.error("Detailed error:", {
        status: e.response?.status,
        statusText: e.response?.statusText,
        data: e.response?.data,
        url: e.config?.url,
      })

      if (e.response?.status === 402) {
        return NextResponse.json({ message: "Training models is only available on paid plans." }, { status: 402 })
      }
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}
