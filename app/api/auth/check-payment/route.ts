import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkUserPayment } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user ID from database using email
    const user = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `
    
    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const hasPaid = await checkUserPayment(user[0].id.toString())
    
    return NextResponse.json({ hasPaid })
  } catch (error) {
    console.error("Error checking payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 