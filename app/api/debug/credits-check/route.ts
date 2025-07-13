import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Checking credits and purchases...")

    // Check credits table
    const creditsResult = await sql`
      SELECT user_id, credits, created_at, updated_at FROM credits ORDER BY user_id
    `

    // Check recent purchases
    const purchasesResult = await sql`
      SELECT id, user_id, stripe_session_id, status, created_at, updated_at 
      FROM purchases 
      ORDER BY created_at DESC 
      LIMIT 10
    `

    // Check users table
    const usersResult = await sql`
      SELECT id, email, created_at FROM users ORDER BY id
    `

    return NextResponse.json({
      credits: creditsResult,
      recentPurchases: purchasesResult,
      users: usersResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error checking credits:", error)
    return NextResponse.json({
      error: "Database error",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
