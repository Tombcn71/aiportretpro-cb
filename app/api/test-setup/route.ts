import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    const checks = {
      // Environment variables
      astria_api_key: !!process.env.ASTRIA_API_KEY,
      webhook_secret: !!process.env.APP_WEBHOOK_SECRET,
      nextauth_url: !!process.env.NEXTAUTH_URL,
      blob_token: !!process.env.BLOB_READ_WRITE_TOKEN,

      // User session
      user_logged_in: !!session?.user?.email,

      // Pack ID (now confirmed)
      pack_id_confirmed: true, // We know it's 928
    }

    // Check if user has credits
    let user_credits = 0
    if (session?.user?.email) {
      try {
        const { getUserByEmail } = await import("@/lib/db")
        const { CreditManager } = await import("@/lib/credits")

        const user = await getUserByEmail(session.user.email)
        if (user) {
          user_credits = await CreditManager.getUserCredits(user.id)
        }
      } catch (error) {
        console.error("Error checking credits:", error)
      }
    }

    const allGood =
      checks.astria_api_key &&
      checks.webhook_secret &&
      checks.nextauth_url &&
      checks.blob_token &&
      checks.user_logged_in &&
      user_credits > 0

    return NextResponse.json({
      ready_for_photoshoot: allGood,
      user_credits,
      pack_id: "928", // ✅ Confirmed pack ID
      pack_name: "Headshots m/w",
      checks,
      warnings: [
        !checks.astria_api_key && "ASTRIA_API_KEY missing",
        !checks.webhook_secret && "Webhook secret missing - photos won't save",
        !checks.blob_token && "Blob storage not configured - uploads will fail",
        user_credits === 0 && "No credits available",
      ].filter(Boolean),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ready_for_photoshoot: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
