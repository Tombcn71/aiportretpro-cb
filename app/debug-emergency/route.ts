import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 DEBUG EMERGENCY STARTING...")

    const tuneId = "2951161"
    const apiKey = process.env.ASTRIA_API_KEY ? "Present" : "Missing"

    console.log(`📡 Fetching prompts for tune ${tuneId}...`)

    // Fetch prompts
    const promptsResponse = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const promptsData = await promptsResponse.json()

    // Fetch tune info
    const tuneResponse = await fetch(`https://api.astria.ai/tunes/${tuneId}`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const tuneData = await tuneResponse.json()

    return NextResponse.json({
      success: true,
      tuneId,
      apiKey,
      promptsResponse: {
        status: promptsResponse.status,
        dataType: typeof promptsData,
        isArray: Array.isArray(promptsData),
        length: Array.isArray(promptsData) ? promptsData.length : 0,
        data: promptsData,
      },
      tuneResponse: {
        status: tuneResponse.status,
        data: tuneData,
      },
    })
  } catch (error) {
    console.error("❌ Debug failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Debug failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
