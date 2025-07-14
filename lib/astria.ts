import axios from "axios"

const ASTRIA_DOMAIN = "https://api.astria.ai"
const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY

if (!ASTRIA_API_KEY) {
  throw new Error("ASTRIA_API_KEY is not set")
}

// ✅ NIEUWE FUNCTIE: Gebruik geselecteerde pack
export async function generateWithSelectedPack(data: {
  packId: string
  images: string[]
  projectName: string
  gender: string
  projectId: number
}) {
  try {
    console.log(`🎯 Using selected pack: ${data.packId}`)

    // Validate required environment variables
    if (!process.env.APP_WEBHOOK_SECRET) {
      throw new Error("APP_WEBHOOK_SECRET is not set")
    }

    if (!process.env.NEXTAUTH_URL) {
      throw new Error("NEXTAUTH_URL is not set")
    }

    const deploymentUrl = process.env.NEXTAUTH_URL
    const baseUrl =
      deploymentUrl.startsWith("http://") || deploymentUrl.startsWith("https://")
        ? deploymentUrl
        : `https://${deploymentUrl}`

    const promptWebhook = `${baseUrl}/api/astria/prompt-webhook`
    const promptWebhookWithParams = `${promptWebhook}?user_id=1&model_id=${data.projectId}&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`

    console.log(
      "🔗 Webhook URL being sent to Astria:",
      promptWebhookWithParams.replace(process.env.APP_WEBHOOK_SECRET, "***SECRET***"),
    )

    // Map gender to Astria format
    const astriaGender = data.gender === "man" ? "man" : data.gender === "woman" ? "woman" : "person"

    // Create professional prompts
    const prompts = [
      `professional headshot of ohwx ${astriaGender}, business suit, clean white background, corporate photography, high quality, detailed, professional lighting, 8k resolution`,
      `linkedin profile picture of ohwx ${astriaGender}, professional attire, office background, business casual, corporate headshot, professional photography, high resolution`,
      `portrait of ohwx ${astriaGender} in business casual attire, professional headshot, neutral background, corporate style, high quality photography, detailed`,
    ]

    const results = []

    // Send prompts to selected pack
    for (const prompt of prompts) {
      const promptBody = {
        prompt: {
          text: prompt,
          num_images: 15, // 45 total images
          callback: promptWebhookWithParams,
        },
      }

      console.log(`🎯 Sending prompt to pack ${data.packId}`)
      console.log("📤 Request body:", JSON.stringify(promptBody, null, 2))

      const response = await axios.post(`${ASTRIA_DOMAIN}/tunes/${data.packId}/prompts`, promptBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ASTRIA_API_KEY}`,
        },
        timeout: 30000,
      })

      console.log("✅ Prompt sent successfully!")
      console.log("📥 Astria response:", response.data)
      results.push(response.data)
    }

    return results[0] || { id: "pack-generation", status: "processing" }
  } catch (error) {
    console.error(`Error using pack ${data.packId}:`, error)

    if (axios.isAxiosError(error)) {
      console.error("Pack error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      })

      if (error.response?.status === 401) {
        throw new Error("Astria API authentication failed - check your API key")
      } else if (error.response?.status === 404) {
        throw new Error(`Pack ${data.packId} not found - it may not exist or be accessible`)
      } else if (error.response?.status === 402) {
        throw new Error("Insufficient credits in your Astria account")
      }
    }

    throw error
  }
}

// Keep existing functions for backward compatibility
export async function generateWithYourPack(data: {
  images: string[]
  projectName: string
  gender: string
  projectId: number
}) {
  // Default to pack 928 if no pack selected
  return generateWithSelectedPack({
    packId: "928",
    ...data,
  })
}

export async function testAstriaConnection() {
  try {
    const response = await axios.get(`${ASTRIA_DOMAIN}/tunes`, {
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
      },
    })

    console.log("✅ Astria connection successful")
    return { success: true, data: response.data }
  } catch (error) {
    console.error("❌ Astria connection test failed:", error)
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      }
    }
    return { success: false, error: "Unknown error" }
  }
}

export async function getAstriaModelStatus(tuneId: string) {
  try {
    const response = await axios.get(`${ASTRIA_DOMAIN}/tunes/${tuneId}`, {
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error getting Astria model status:", error)
    throw error
  }
}

// Update redirect functions
export async function trainAstriaModel(data: {
  images: string[]
  name: string
  type: string
  characteristics?: string
  userId: number
  modelId: number
}) {
  // Redirect to use selected pack (default 928)
  return await generateWithYourPack({
    images: data.images,
    projectName: data.name,
    gender: data.type,
    projectId: data.modelId,
  })
}

export async function generateWithExistingModel(data: {
  tuneId: number
  prompts: string[]
  userId: number
  modelId: number
}) {
  return generateWithSelectedPack({
    packId: data.tuneId.toString(),
    images: [], // No input images for existing model
    projectName: "Existing Model Generation",
    gender: "person",
    projectId: data.modelId,
  })
}
