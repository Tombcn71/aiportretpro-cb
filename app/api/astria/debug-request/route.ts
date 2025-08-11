import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    if (!process.env.ASTRIA_API_KEY) {
      return NextResponse.json({ error: "ASTRIA_API_KEY not configured" }, { status: 500 })
    }

    const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY
    const ASTRIA_DOMAIN = "https://api.astria.ai"

    // Test with a minimal request similar to your working models
    const testTuneBody = {
      tune: {
        title: "Debug Test Fixed",
        base_tune_id: 1504944, // Same as your working models
        name: "person",
        branch: "flux1",
        model_type: "lora", // This was missing!
        token: "ohwx",
        image_urls: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
        ],
        args: "preset=flux-lora-fast learning_rate=5e-4 lora_rank=16 lora_alpha=16 train_batch=4",
        face_crop: true,
        // No callback for this test
        prompts_attributes: [
          {
            text: "professional headshot of ohwx person, business suit, clean background",
            num_images: 1,
            // No callback for this test
          },
        ],
      },
    }

    console.log("Sending fixed debug request to Astria...")
    console.log("Request body:", JSON.stringify(testTuneBody, null, 2))

    const response = await axios.post(`${ASTRIA_DOMAIN}/tunes`, testTuneBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ASTRIA_API_KEY}`,
      },
      timeout: 30000,
    })

    console.log("Debug request successful:", {
      status: response.status,
      tuneId: response.data?.id,
    })

    return NextResponse.json({
      success: true,
      message: "Debug request successful with model_type fix",
      tuneId: response.data?.id,
      status: response.data?.status,
      response: response.data,
    })
  } catch (error) {
    console.error("Debug request failed:", error)

    if (axios.isAxiosError(error)) {
      console.error("Detailed error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
      })

      return NextResponse.json(
        {
          error: "Debug request failed",
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          requestData: error.config?.data,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: "Unknown error during debug request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
