import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const { projectName, gender, selectedPackId, uploadedPhotos } = await request.json()

    if (!process.env.ASTRIA_API_KEY) {
      return NextResponse.json({ error: "ASTRIA_API_KEY not configured" }, { status: 500 })
    }

    const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY
    const DOMAIN = "https://api.astria.ai"

    // Test the exact same request but catch the 422 error details
    const packBody = {
      name: gender,
      title: projectName,
      image_urls: uploadedPhotos,
      callback: "https://example.com/test", // Dummy webhook for testing
      prompt_attributes: {
        callback: "https://example.com/test-prompt",
      },
    }

    console.log(`🔍 Testing request to pack ${selectedPackId}:`)
    console.log(`Body:`, JSON.stringify(packBody, null, 2))

    try {
      const response = await axios.post(`${DOMAIN}/p/${selectedPackId}/tunes`, packBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ASTRIA_API_KEY}`,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Request would succeed",
        response: response.data,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("422 Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        })

        return NextResponse.json({
          error: "422 Validation Error",
          status: error.response?.status,
          statusText: error.response?.statusText,
          validation_errors: error.response?.data,
          request_body: packBody,
          pack_id: selectedPackId,
        })
      }

      throw error
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
