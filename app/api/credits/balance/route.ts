import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("🔍 Checking credits for user:", session.user.email)

    // Get user
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (!userResult[0]) {
      console.log("❌ User not found:", session.user.email)
      return NextResponse.json({ credits: 0 })
    }

    const userId = userResult[0].id
    console.log("👤 User ID:", userId)

    // Get credits
    const creditsResult = await sql`
      SELECT credits FROM credits WHERE user_id = ${userId}
    `

    console.log("💰 Credits result:", creditsResult)

    const credits = creditsResult[0]?.credits || 0

    console.log("✅ Final credits:", credits)

    return NextResponse.json({ credits })
  } catch (error) {
    console.error("❌ Error fetching credits:", error)
    return NextResponse.json({ credits: 0 })
  }
}
