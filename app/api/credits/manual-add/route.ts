import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Add 1 credit manually
    await sql`
      INSERT INTO credits (user_id, credits)
      VALUES (${user.id}, 1)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        credits = credits.credits + 1,
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true, message: "1 credit added" })
  } catch (error) {
    console.error("Error adding credit:", error)
    return NextResponse.json({ error: "Failed to add credit" }, { status: 500 })
  }
}
