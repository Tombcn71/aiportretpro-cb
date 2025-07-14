import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("🧪 Simple webhook test received:", body)

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      body,
    })
  } catch (error) {
    console.error("Error in simple webhook test:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
