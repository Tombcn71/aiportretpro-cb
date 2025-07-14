const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY
const ASTRIA_API_URL = process.env.ASTRIA_API_URL || "https://api.astria.ai"

if (!ASTRIA_API_KEY) {
  throw new Error("ASTRIA_API_KEY is not set")
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

export async function testAstriaConnection() {
  try {
    const response = await fetch(`${ASTRIA_API_URL}/tunes`, {
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Astria API connection failed: ${response.statusText}`)
    }

    return { success: true, message: "Astria connection successful" }
  } catch (error) {
    console.error("Astria connection test failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function generateWithExistingModel(tuneId: string, prompts: string[]) {
  const results = []

  for (const prompt of prompts) {
    try {
      const response = await fetch(`${ASTRIA_API_URL}/tunes/${tuneId}/prompts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ASTRIA_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: {
            text: prompt,
            num_images: 1,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate with existing model: ${response.statusText}`)
      }

      const result = await response.json()
      results.push(result)
    } catch (error) {
      console.error(`Error generating with prompt "${prompt}":`, error)
      results.push({ error: error instanceof Error ? error.message : "Unknown error" })
    }
  }

  return results
}

export async function getAstriaModelStatus(tuneId: string) {
  try {
    const response = await fetch(`${ASTRIA_API_URL}/tunes/${tuneId}`, {
      headers: {
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get model status: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      status: data.status,
      data: data,
    }
  } catch (error) {
    console.error("Error getting Astria model status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateWithSelectedPack(
  packId: string,
  prompts: string[],
  projectData: {
    title: string
    name: string
    imageUrls: string[]
    projectId: number
    userId: number
  },
) {
  try {
    // First create the tune with the pack
    const tuneResult = await createTuneWithPack(packId, projectData)

    if (!tuneResult.id) {
      throw new Error("Failed to create tune - no ID returned")
    }

    // Wait a moment for the tune to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate images with the prompts
    const generateResults = await generateWithExistingModel(tuneResult.id.toString(), prompts)

    return {
      success: true,
      tuneId: tuneResult.id,
      generateResults: generateResults,
    }
  } catch (error) {
    console.error("Error generating with selected pack:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
