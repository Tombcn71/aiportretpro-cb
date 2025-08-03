import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const tuneId = url.searchParams.get("tune_id")

    if (!tuneId) {
      return NextResponse.json(
        {
          error: "tune_id parameter is required",
          success: false,
        },
        { status: 400 },
      )
    }

    console.log(`��� Checking webhook for tune ID: ${tuneId}`)

    // Check if we can fetch the tune info from Astria
    const astriaResponse = await fetch(`https://api.astria.ai/tunes/${tuneId}`, {
      headers: {
        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!astriaResponse.ok) {
      const errorText = await astriaResponse.text()
      console.error(`❌ Astria API error: ${astriaResponse.status} - ${errorText}`)

      return NextResponse.json(
        {
          error: `Failed to fetch tune from Astria (${astriaResponse.status})`,
          details: errorText,
          success: false,
          tuneId,
        },
        { status: 400 },
      )
    }

    const tuneData = await astriaResponse.json()
    console.log(`✅ Successfully fetched tune data for ${tuneId}`)

    const expectedWebhookUrl = `https://www.aiportretpro.nl/api/astria/prompt-webhook?user_id=1&model_id=${tuneId}&webhook_secret=${process.env.APP_WEBHOOK_SECRET}`

    return NextResponse.json({
      success: true,
      tuneId,
      tuneData: {
        id: tuneData.id,
        title: tuneData.title,
        status: tuneData.status,
        model_type: tuneData.model_type,
        created_at: tuneData.created_at,
        updated_at: tuneData.updated_at,
      },
      expectedWebhookUrl,
      instructions: [
        "1. Go to astria.ai/tunes",
        "2. Find your tune and click on it",
        "3. Look for 'Webhook URL' or 'Callback URL'",
        "4. Make sure it matches the expectedWebhookUrl above",
        "5. If not, copy and paste the correct URL",
        "6. Save the changes",
      ],
      nextSteps: [
        "Set webhook URL in Astria dashboard",
        "Test with small generation",
        "Monitor server logs",
        "Check dashboard for photos",
      ],
    })
  } catch (error) {
    console.error("❌ Error checking webhook:", error)
    return NextResponse.json(
      {
        error: "Failed to check webhook",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    )
  }
}
