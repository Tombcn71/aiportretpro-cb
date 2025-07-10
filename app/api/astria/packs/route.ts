import { NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Set dynamic route handling
export const dynamic = "force-dynamic"

// Environment Variables
const API_KEY = process.env.ASTRIA_API_KEY
const QUERY_TYPE = process.env.PACK_QUERY_TYPE || "users" // Default to 'users'
const DOMAIN = "https://api.astria.ai"

// Check if API Key is missing
if (!API_KEY) {
  throw new Error("MISSING ASTRIA_API_KEY!")
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 },
      )
    }

    // Authorization header
    const headers = { Authorization: `Bearer ${API_KEY}` }

    // Define the endpoints based on the query type
    const endpoints: string[] = []

    if (QUERY_TYPE === "users" || QUERY_TYPE === "both") {
      endpoints.push(`${DOMAIN}/packs`)
    }

    if (QUERY_TYPE === "gallery" || QUERY_TYPE === "both") {
      endpoints.push(`${DOMAIN}/gallery/packs`)
    }

    console.log("Fetching packs from Astria API endpoints:", endpoints)

    // Make concurrent requests
    const responses = await Promise.all(endpoints.map((url) => axios.get(url, { headers })))

    // Combine the data from both responses
    const combinedData = responses.flatMap((response) => response.data)

    console.log(`Found ${combinedData.length} total packs from Astria API`)
    console.log(
      "Available pack IDs:",
      combinedData.map((p: any) => p.id),
    )

    // Filter for headshot/portrait packs
    const headshotPacks = combinedData.filter(
      (pack: any) =>
        pack.title?.toLowerCase().includes("headshot") ||
        pack.title?.toLowerCase().includes("portrait") ||
        pack.title?.toLowerCase().includes("professional") ||
        pack.title?.toLowerCase().includes("business") ||
        pack.title?.toLowerCase().includes("linkedin") ||
        pack.category?.toLowerCase().includes("headshot"),
    )

    console.log(`Filtered to ${headshotPacks.length} headshot packs`)

    // Return the combined data as JSON
    return NextResponse.json({
      all_packs: combinedData,
      headshot_packs: headshotPacks,
      total_packs: combinedData.length,
      headshot_count: headshotPacks.length,
    })
  } catch (error) {
    console.error("Error fetching packs from Astria API:", error)

    if (axios.isAxiosError(error)) {
      console.error("Astria API error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      })

      if (error.response?.status === 401) {
        return NextResponse.json(
          {
            message: "Unauthorized - check your Astria API key",
          },
          { status: 401 },
        )
      }
    }

    // Return error response
    return NextResponse.json(
      {
        message: "Failed to fetch packs from Astria API.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
