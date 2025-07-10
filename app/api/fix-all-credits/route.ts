import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔧 Starting credit fix process...")

    // First, ensure credits table exists with proper schema
    await sql`
      CREATE TABLE IF NOT EXISTS credits (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        credits INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Get all unique users from projects
    const users = await sql`
      SELECT DISTINCT user_id 
      FROM projects 
      WHERE user_id IS NOT NULL
    `

    console.log(`👥 Found ${users.length} unique users`)

    let creditsAdded = 0

    for (const user of users) {
      try {
        // Count projects for this user
        const projectCount = await sql`
          SELECT COUNT(*) as count
          FROM projects 
          WHERE user_id = ${user.user_id}
        `

        const count = Number.parseInt(projectCount[0].count)

        if (count > 0) {
          // Insert or update credits
          await sql`
            INSERT INTO credits (user_id, credits)
            VALUES (${user.user_id}, ${count})
            ON CONFLICT (user_id) 
            DO UPDATE SET 
              credits = GREATEST(credits, ${count}),
              updated_at = CURRENT_TIMESTAMP
          `

          creditsAdded += count
          console.log(`✅ User ${user.user_id}: ${count} credits`)
        }
      } catch (userError) {
        console.error(`❌ Error processing user ${user.user_id}:`, userError)
      }
    }

    console.log(`🎉 Credit fix complete! Added ${creditsAdded} total credits`)

    return NextResponse.json({
      success: true,
      message: `Fixed credits for ${users.length} users`,
      totalCreditsAdded: creditsAdded,
    })
  } catch (error) {
    console.error("❌ Fix credits error:", error)
    return NextResponse.json(
      {
        error: "Failed to fix credits",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
