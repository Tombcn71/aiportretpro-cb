import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectName, gender, images } = await request.json()

    if (!projectName || !gender || !images || images.length === 0) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Save wizard data to database
    const result = await sql`
      INSERT INTO wizard_sessions (user_email, project_name, gender, images, status, created_at)
      VALUES (${session.user.email}, ${projectName}, ${gender}, ${JSON.stringify(images)}, 'pending', NOW())
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      sessionId: result[0].id,
    })
  } catch (error) {
    console.error("Error saving wizard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const result = await sql`
      SELECT * FROM wizard_sessions 
      WHERE id = ${sessionId} AND user_email = ${session.user.email}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error getting wizard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    await sql`
      DELETE FROM wizard_sessions 
      WHERE id = ${sessionId} AND user_email = ${session.user.email}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting wizard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Named exports for the missing functions
export async function getWizardData(sessionId: string, userEmail: string) {
  const result = await sql`
    SELECT * FROM wizard_sessions 
    WHERE id = ${sessionId} AND user_email = ${userEmail}
  `
  return result[0] || null
}

export async function deleteWizardData(sessionId: string, userEmail: string) {
  await sql`
    DELETE FROM wizard_sessions 
    WHERE id = ${sessionId} AND user_email = ${userEmail}
  `
  return true
}
