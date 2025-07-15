import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)
const ASTRIA_API_URL = process.env.ASTRIA_API_URL || "https://api.astria.ai"
const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY

if (!ASTRIA_API_KEY) {
  throw new Error("ASTRIA_API_KEY is required")
}

export async function testAstriaConnection() {
  try {
    const response = await fetch(`${ASTRIA_API_URL}/tunes`, {
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Astria API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      data,
      message: "Successfully connected to Astria API",
    }
  } catch (error) {
    console.error("Astria connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateWithExistingModel(modelId: string, prompts: string[]) {
  try {
    const results = []

    for (const prompt of prompts) {
      const response = await fetch(`${ASTRIA_API_URL}/tunes/${modelId}/prompts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ASTRIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            text: prompt,
            num_images: 4,
            callback: `${process.env.NEXTAUTH_URL}/api/astria/prompt-webhook?user_id=1&model_id=${modelId}&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate with prompt: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      results.push(result)
    }

    return {
      success: true,
      results,
      message: `Generated ${results.length} prompts successfully`,
    }
  } catch (error) {
    console.error("Generation with existing model failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getAstriaModelStatus(tuneId: string) {
  try {
    const response = await fetch(`${ASTRIA_API_URL}/tunes/${tuneId}`, {
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get model status: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      data,
      status: data.status || "unknown",
    }
  } catch (error) {
    console.error("Get model status failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateWithSelectedPack(options: {
  packId: string
  images: string[]
  projectName: string
  gender: string
  projectId: number
}) {
  try {
    console.log("🎯 Generating with selected pack:", options)

    const response = await fetch("https://api.astria.ai/tunes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tune: {
          title: `${options.projectName} - ${options.gender}`,
          name: `project_${options.projectId}_${Date.now()}`,
          image_urls: options.images,
          callback: `${process.env.NEXTAUTH_URL}/api/astria/train-webhook?userId=1&modelId=${options.projectId}&webhookSecret=${process.env.APP_WEBHOOK_SECRET}`,
        },
        pack_id: options.packId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Generate with pack error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(`Failed to generate with pack: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log("✅ Generation started:", result)

    return result
  } catch (error) {
    console.error("❌ Error generating with selected pack:", error)
    throw error
  }
}

export async function createTuneWithPack(
  packId: string,
  options: {
    title: string
    name: string
    imageUrls: string[]
    projectId: number
    userId: number
  },
) {
  try {
    console.log("🎨 Creating tune with pack:", { packId, ...options })

    const response = await fetch("https://api.astria.ai/tunes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tune: {
          title: options.title,
          name: options.name,
          image_urls: options.imageUrls,
          callback: `${process.env.NEXTAUTH_URL}/api/astria/train-webhook?userId=${options.userId}&modelId=${options.projectId}&webhookSecret=${process.env.APP_WEBHOOK_SECRET}`,
        },
        pack_id: packId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Astria API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(`Astria API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log("✅ Tune created successfully:", result)

    return result
  } catch (error) {
    console.error("❌ Error creating tune with pack:", error)
    throw error
  }
}

export async function getTuneStatus(tuneId: string) {
  const response = await fetch(`${ASTRIA_API_URL}/tunes/${tuneId}`, {
    headers: {
      Authorization: `Bearer ${ASTRIA_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get tune status: ${response.statusText}`)
  }

  return response.json()
}

export async function getPromptStatus(promptId: string) {
  const response = await fetch(`${ASTRIA_API_URL}/prompts/${promptId}`, {
    headers: {
      Authorization: `Bearer ${ASTRIA_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get prompt status: ${response.statusText}`)
  }

  return response.json()
}

export async function getTunePrompts(tuneId: string) {
  const response = await fetch(`${ASTRIA_API_URL}/tunes/${tuneId}/prompts`, {
    headers: {
      Authorization: `Bearer ${ASTRIA_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get tune prompts: ${response.statusText}`)
  }

  return response.json()
}
