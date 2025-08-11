import { NextResponse } from "next/server"
import { testAstriaConnection } from "@/lib/astria"

export async function GET() {
  try {
    const result = await testAstriaConnection()

    return NextResponse.json({
      astria_configured: !!process.env.ASTRIA_API_KEY,
      webhook_secret_configured: !!process.env.APP_WEBHOOK_SECRET,
      nextauth_url_configured: !!process.env.NEXTAUTH_URL,
      test_mode: process.env.ASTRIA_TEST_MODE === "true",
      connection_test: result,
    })
  } catch (error) {
    console.error("Astria test error:", error)
    return NextResponse.json(
      {
        error: "Failed to test Astria connection",
        details: error instanceof Error ? error.message : "Unknown error",
        astria_configured: !!process.env.ASTRIA_API_KEY,
        webhook_secret_configured: !!process.env.APP_WEBHOOK_SECRET,
        nextauth_url_configured: !!process.env.NEXTAUTH_URL,
      },
      { status: 500 },
    )
  }
}
