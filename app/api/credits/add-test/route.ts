import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail } from "@/lib/db"
import { CreditManager } from "@/lib/credits"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await CreditManager.addCredits(user.id, 5)

    return NextResponse.json({ success: true, message: "5 credits added" })
  } catch (error) {
    console.error("Error adding test credits:", error)
    return NextResponse.json({ error: "Failed to add credits" }, { status: 500 })
  }
}
