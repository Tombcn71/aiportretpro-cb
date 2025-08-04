import axios from "axios"

export const ASTRIA_PACKS = {
  men: "928",
  women: "928",
  default: "928",
}

export function getPackId(gender?: string): string {
  return "928" // Always use pack 928
}

export function getPackName(gender: string): string {
  return gender === "man" ? "928 man" : "928 woman"
}

if (!process.env.ASTRIA_API_KEY) {
  throw new Error("ASTRIA_API_KEY is not set")
}

const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY
const ASTRIA_DOMAIN = "https://api.astria.ai"

export interface PackTrainRequest {
  packId: string
  images: string[]
  projectName: string
  gender: string
  characteristics?: string
  projectId: number
}

// New pack-based training using the official flow
export async function trainWithPack(data: PackTrainRequest) {
  try {
    console.log("Training with pack using official Astria flow...")
    console.log("Pack training data:", {
      packId: data.packId,
      imageCount: data.images.length,
      projectName: data.projectName,
      gender: data.gender,
      projectId: data.projectId,
    })

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

    const trainWebhook = `${baseUrl}/api/astria/wizard-webhook/${data.projectId}`
    const promptWebhook = `${baseUrl}/api/astria/wizard-prompt-webhook/${data.projectId}`

    // Map gender to class name
    const className = data.gender === "man" ? "man" : data.gender === "woman" ? "woman" : "person"

    // Use pack ID from ASTRIA_PACKS based on gender
    const packId = getPackId(data.gender)

    // Use the new pack-based API endpoint
    const tuneBody = {
      tune: {
        title: data.projectName,
        images: data.images,
        class_name: className,
        characteristics: data.characteristics || `professional ${className}`,
        callback: trainWebhook,
        prompts_attributes: [
          {
            text: `professional headshot of ohwx ${className}, business suit, clean white background, corporate photography, high quality, detailed, professional lighting, 8k resolution`,
            callback: promptWebhook,
            num_images: 10,
          },
          {
            text: `linkedin profile picture of ohwx ${className}, professional attire, office background, business casual, corporate headshot, professional photography, high resolution`,
            callback: promptWebhook,
            num_images: 10,
          },
          {
            text: `portrait of ohwx ${className} in business casual attire, professional headshot, neutral background, corporate style, high quality photography, detailed`,
            callback: promptWebhook,
            num_images: 10,
          },
          {
            text: `corporate headshot of ohwx ${className}, professional blazer, studio lighting, clean background, business portrait, high resolution, detailed`,
            callback: promptWebhook,
            num_images: 10,
          },
        ],
      },
    }

    console.log("Sending pack-based request to Astria API...")
    console.log("Using pack ID:", packId)

    // Use the new pack endpoint: POST /p/:id/tunes
    const response = await axios.post(`${ASTRIA_DOMAIN}/p/${packId}/tunes`, tuneBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
      },
      timeout: 30000,
    })

    console.log("Pack-based training response:", {
      status: response.status,
      tuneId: response.data?.id,
      packId: packId,
    })

    return response.data
  } catch (error) {
    console.error("Error training with pack:", error)

    if (axios.isAxiosError(error)) {
      console.error("Pack training error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      })

      if (error.response?.status === 400) {
        throw new Error(`Pack training validation error: ${JSON.stringify(error.response.data)}`)
      } else if (error.response?.status === 401) {
        throw new Error("Astria API authentication failed - check your API key")
      } else if (error.response?.status === 404) {
        throw new Error(`Pack not found: ${data.packId}`)
      }
    }

    throw error
  }
}

// Image inspection API to validate quality
export async function inspectImages(images: string[]) {
  try {
    const results = []

    for (const image of images) {
      const response = await axios.post(
        `${ASTRIA_DOMAIN}/images/inspect`,
        {
          image_url: image,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ASTRIA_API_KEY}`,
          },
        },
      )

      results.push({
        image_url: image,
        inspection: response.data,
      })
    }

    return results
  } catch (error) {
    console.error("Error inspecting images:", error)
    throw error
  }
}
