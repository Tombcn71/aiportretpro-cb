import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user
    const users = await sql`
      SELECT id, email, name, created_at FROM users WHERE email = ${session.user.email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Get credits
    const credits = await sql`
      SELECT credits FROM credits WHERE user_id = ${user.id}
    `

    // Get purchases
    const purchases = await sql`
      SELECT id, stripe_session_id, status, amount, created_at 
      FROM purchases 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 5
    `

    // Get projects
    const projects = await sql`
      SELECT id, name, status, tune_id, prediction_id, created_at, updated_at,
             CASE 
               WHEN generated_photos IS NOT NULL THEN 
                 CASE 
                   WHEN jsonb_typeof(generated_photos::jsonb) = 'array' THEN jsonb_array_length(generated_photos::jsonb)
                   ELSE 1
                 END
               ELSE 0
             END as photo_count
      FROM projects 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 10
    `

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: new Date(user.created_at).toLocaleString("nl-NL"),
      },
      credits: credits[0]?.credits || 0,
      purchases: purchases.map(p => ({
        ...p,
        created_at: new Date(p.created_at).toLocaleString("nl-NL"),
      })),
      projects: projects.map(p => ({
        ...p,
        created_at: new Date(p.created_at).toLocaleString("nl-NL"),
        updated_at: new Date(p.updated_at).toLocaleString("nl-NL"),
        has_tune_id: !!p.tune_id,
        has_prediction_id: !!p.prediction_id,
      })),
      sessionValid: true,
    })
  } catch (error) {
    console.error("User status check error:", error)
    return NextResponse.json(
      { 
        error: "Failed to check user status", 
        details: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    )
  }
}

