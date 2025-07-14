import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simple test endpoint
    return NextResponse.json({
      status: "success",
      message: "Webhook endpoint is working",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST() {
  try {
    return NextResponse.json({
      status: "success",
      message: "POST webhook test successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test webhook POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
