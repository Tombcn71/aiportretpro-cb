import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Debug webhook test starting...")

    // Get all purchases
    const purchases = await sql`
      SELECT * FROM purchases ORDER BY created_at DESC
    `

    // Get all credits
    const credits = await sql`
      SELECT * FROM credits ORDER BY user_id
    `

    // Get all users
    const users = await sql`
      SELECT id, email, name FROM users ORDER BY id
    `

    // Check webhook endpoint accessibility
    const webhookUrl = `${process.env.NEXTAUTH_URL}/api/stripe/webhook`
    console.log("🔗 Webhook URL:", webhookUrl)

    // Check environment variables
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    }

    return NextResponse.json({
      purchases,
      credits,
      users,
      webhookUrl,
      environment: envCheck,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Debug error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
