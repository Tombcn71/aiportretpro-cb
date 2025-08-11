import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    if (!process.env.ASTRIA_API_KEY) {
      return NextResponse.json({ error: "ASTRIA_API_KEY not configured" }, { status: 500 })
    }

    const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY
    const ASTRIA_DOMAIN = "https://api.astria.ai"

    console.log("🔍 Debugging pack 928...")

    // 1. Check if pack 928 exists
    let pack928Status = null
    try {
      const packResponse = await axios.get(`${ASTRIA_DOMAIN}/tunes/928`, {
        headers: {
          Authorization: `Bearer ${ASTRIA_API_KEY}`,
        },
      })
      pack928Status = {
        exists: true,
        status: packResponse.status,
        title: packResponse.data?.title,
        trained_at: packResponse.data?.trained_at,
        id: packResponse.data?.id,
      }
    } catch (packError) {
      pack928Status = {
        exists: false,
        error: axios.isAxiosError(packError)
          ? {
              status: packError.response?.status,
              message: packError.response?.data || packError.message,
            }
          : "Unknown error",
      }
    }

    // 2. List your tunes to find the correct ID
    let yourTunes = []
    try {
      const tunesResponse = await axios.get(`${ASTRIA_DOMAIN}/tunes`, {
        headers: {
          Authorization: `Bearer ${ASTRIA_API_KEY}`,
        },
      })
      yourTunes =
        tunesResponse.data?.map((tune: any) => ({
          id: tune.id,
          title: tune.title,
          trained_at: tune.trained_at,
          status: tune.status,
          created_at: tune.created_at,
        })) || []
    } catch (tunesError) {
      console.error("Error fetching tunes:", tunesError)
    }

    // 3. Check if there are any headshot-related packs
    const headshotTunes = yourTunes.filter(
      (tune: any) =>
        tune.title?.toLowerCase().includes("headshot") ||
        tune.title?.toLowerCase().includes("portrait") ||
        tune.title?.toLowerCase().includes("professional"),
    )

    return NextResponse.json({
      pack_928_status: pack928Status,
      your_tunes_count: yourTunes.length,
      your_tunes: yourTunes,
      headshot_tunes: headshotTunes,
      debug_info: {
        api_key_configured: !!ASTRIA_API_KEY,
        api_domain: ASTRIA_DOMAIN,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
