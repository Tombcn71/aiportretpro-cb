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

export async function generateWithSelectedPack(packId: string, userId: string, projectId: string) {
  try {
    // Create tune with pack
    const response = await fetch(`${ASTRIA_API_URL}/p/${packId}/tunes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tune: {
          title: `Project ${projectId}`,
          name: `project_${projectId}_${Date.now()}`,
          callback: `${process.env.NEXTAUTH_URL}/api/astria/train-webhook?user_id=${userId}&model_id=${projectId}&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`,
          prompt_attributes: {
            callback: `${process.env.NEXTAUTH_URL}/api/astria/prompt-webhook?user_id=${userId}&model_id=${projectId}&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`,
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create tune with pack: ${response.status} ${response.statusText}`)
    }

    const tuneData = await response.json()

    return {
      success: true,
      tuneId: tuneData.id,
      message: "Successfully started generation with selected pack",
    }
  } catch (error) {
    console.error("Generate with selected pack failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function createTuneWithPack(
  packId: string,
  projectData: {
    title: string
    name: string
    imageUrls: string[]
    projectId: number
    userId: number
  },
) {
  const webhookUrl = `${process.env.NEXTAUTH_URL}/api/astria/train-webhook?user_id=${projectData.userId}&model_id=${projectData.projectId}&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`
  const promptWebhookUrl = `${process.env.NEXTAUTH_URL}/api/astria/prompt-webhook?user_id=${projectData.userId}&model_id=${projectData.projectId}&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`

  console.log("🎯 Creating tune with pack:", {
    packId,
    title: projectData.title,
    name: projectData.name,
    imageCount: projectData.imageUrls.length,
    webhookUrl,
    promptWebhookUrl,
  })

  const payload = {
    tune: {
      title: projectData.title,
      name: projectData.name,
      callback: webhookUrl,
      prompt_attributes: {
        callback: promptWebhookUrl,
      },
      image_urls: projectData.imageUrls,
    },
  }

  console.log("🚀 Sending to Astria:", {
    url: `${ASTRIA_API_URL}/p/${packId}/tunes`,
    payload,
  })

  const response = await fetch(`${ASTRIA_API_URL}/p/${packId}/tunes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ASTRIA_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ Astria API error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    })
    throw new Error(`Astria API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const result = await response.json()
  console.log("✅ Astria response:", result)

  return result
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
