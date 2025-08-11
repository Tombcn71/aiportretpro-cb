import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔧 FIXING ALL CREDITS - FINAL FIX")

    // Get user
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (!userResult[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult[0].id

    // Count ALL purchases for this user
    const purchaseCount = await sql`
      SELECT COUNT(*) as total FROM purchases WHERE user_id = ${userId}
    `

    const totalPurchases = Number.parseInt(purchaseCount[0]?.total || "0")
    console.log(`Found ${totalPurchases} total purchases for user ${userId}`)

    // Mark all as completed
    await sql`
      UPDATE purchases SET status = 'completed', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    // Check if user already has credits
    const existingCredit = await sql`
      SELECT credits FROM credits WHERE user_id = ${userId}
    `

    let creditResult
    if (existingCredit[0]) {
      // Update existing credits
      creditResult = await sql`
        UPDATE credits 
        SET credits = ${totalPurchases}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
        RETURNING credits
      `
    } else {
      // Create new credits record
      creditResult = await sql`
        INSERT INTO credits (user_id, credits, created_at, updated_at)
        VALUES (${userId}, ${totalPurchases}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING credits
      `
    }

    console.log("✅ FINAL FIX COMPLETE")

    return NextResponse.json({
      success: true,
      totalPurchases,
      credits: creditResult[0]?.credits,
      message: `Fixed! You now have ${creditResult[0]?.credits} credits for your ${totalPurchases} purchases.`,
    })
  } catch (error) {
    console.error("❌ Final fix error:", error)
    return NextResponse.json(
      {
        error: "Final fix failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
