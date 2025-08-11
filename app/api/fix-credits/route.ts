import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    console.log("🔧 Fixing credits...")

    // First check current state
    const currentCredits = await sql`
      SELECT user_id, credits FROM credits WHERE user_id = 1
    `
    console.log("Current credits:", currentCredits)

    const pendingPurchases = await sql`
      SELECT COUNT(*) as count FROM purchases WHERE user_id = 1 AND status = 'pending'
    `
    console.log("Pending purchases:", pendingPurchases[0]?.count)

    // Fix: Set credits to 5 for user 1
    const creditResult = await sql`
      INSERT INTO credits (user_id, credits, created_at, updated_at)
      VALUES (1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        credits = 5,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    // Mark all pending purchases as completed
    const purchaseResult = await sql`
      UPDATE purchases 
      SET status = 'completed', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = 1 AND status = 'pending'
      RETURNING COUNT(*) as updated_count
    `

    console.log("✅ Credits fixed:", creditResult[0])
    console.log("✅ Purchases updated:", purchaseResult.length)

    return NextResponse.json({
      success: true,
      credits: creditResult[0],
      purchasesUpdated: purchaseResult.length,
      message: "Credits fixed! You now have 5 credits.",
    })
  } catch (error) {
    console.error("❌ Error fixing credits:", error)
    return NextResponse.json(
      {
        error: "Failed to fix credits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
