import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get the most recent purchases
    const recentPurchases = await sql`
      SELECT id, user_id, stripe_session_id, status, created_at
      FROM purchases 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    // Check what type user_id actually is
    const purchaseWithTypes = recentPurchases.map((purchase) => ({
      ...purchase,
      user_id_type: typeof purchase.user_id,
      user_id_value: purchase.user_id,
    }))

    return NextResponse.json({
      recentPurchases: purchaseWithTypes,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      {
        error: "Debug error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
