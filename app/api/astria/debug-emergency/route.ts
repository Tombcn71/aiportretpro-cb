import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 DEBUG EMERGENCY FETCH STARTING...")

    const tuneId = "2951161"
    console.log(`📡 Fetching prompts for tune ${tuneId}...`)

    const response = await fetch(`https://api.astria.ai/tunes/${tuneId}/prompts`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    console.log(`📊 Response status: ${response.status}`)
    console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Astria API error: ${response.status} - ${errorText}`)
      return NextResponse.json(
        {
          error: `Astria API error: ${response.status}`,
          details: errorText,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        },
        { status: 500 },
      )
    }

    const promptsData = await response.json()
    console.log("🔍 FULL API RESPONSE:")
    console.log(JSON.stringify(promptsData, null, 2))

    // Let's also try the tune endpoint
    const tuneResponse = await fetch(`https://api.astria.ai/tunes/${tuneId}`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    let tuneData = null
    if (tuneResponse.ok) {
      tuneData = await tuneResponse.json()
      console.log("🔍 TUNE DATA:")
      console.log(JSON.stringify(tuneData, null, 2))
    }

    return NextResponse.json({
      success: true,
      debug: true,
      tuneId,
      promptsResponse: {
        status: response.status,
        data: promptsData,
        dataType: typeof promptsData,
        isArray: Array.isArray(promptsData),
        length: Array.isArray(promptsData) ? promptsData.length : "not array",
      },
      tuneResponse: tuneData
        ? {
            status: tuneResponse.status,
            data: tuneData,
          }
        : "Failed to fetch tune data",
      apiKey: process.env.ASTRIA_API_KEY ? "Present" : "Missing",
      message: "Debug data collected - check console logs",
    })
  } catch (error) {
    console.error("❌ Debug fetch failed:", error)
    return NextResponse.json(
      {
        error: "Debug fetch failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
