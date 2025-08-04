import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { wizardSessionId, projectName, gender, photos } = await request.json()

    if (!wizardSessionId) {
      return NextResponse.json({ error: "Wizard session ID required" }, { status: 400 })
    }

    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult[0].id

    // Save or update wizard session
    await sql`
      INSERT INTO wizard_sessions (id, user_id, project_name, gender, photos, created_at, updated_at)
      VALUES (${wizardSessionId}, ${userId}, ${projectName || null}, ${gender || null}, ${JSON.stringify(photos || [])}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (id) 
      DO UPDATE SET 
        project_name = EXCLUDED.project_name,
        gender = EXCLUDED.gender,
        photos = EXCLUDED.photos,
        updated_at = CURRENT_TIMESTAMP
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Save wizard data error:", error)
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
    const wizardSessionId = searchParams.get("wizardSessionId")

    if (!wizardSessionId) {
      return NextResponse.json({ error: "Wizard session ID required" }, { status: 400 })
    }

    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult[0].id

    // Get wizard session data
    const wizardResult = await sql`
      SELECT * FROM wizard_sessions 
      WHERE id = ${wizardSessionId} AND user_id = ${userId}
    `

    if (wizardResult.length === 0) {
      return NextResponse.json({ error: "Wizard session not found" }, { status: 404 })
    }

    const wizardData = wizardResult[0]
    return NextResponse.json({
      wizardSessionId: wizardData.id,
      projectName: wizardData.project_name,
      gender: wizardData.gender,
      photos: wizardData.photos ? JSON.parse(wizardData.photos) : [],
    })
  } catch (error) {
    console.error("Get wizard data error:", error)
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
    const wizardSessionId = searchParams.get("wizardSessionId")

    if (!wizardSessionId) {
      return NextResponse.json({ error: "Wizard session ID required" }, { status: 400 })
    }

    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult[0].id

    // Delete wizard session
    await sql`
      DELETE FROM wizard_sessions 
      WHERE id = ${wizardSessionId} AND user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete wizard data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Export functions for use in other files
export async function getWizardData(wizardSessionId: string, userEmail: string) {
  try {
    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const userId = userResult[0].id

    // Get wizard session data
    const wizardResult = await sql`
      SELECT * FROM wizard_sessions 
      WHERE id = ${wizardSessionId} AND user_id = ${userId}
    `

    if (wizardResult.length === 0) {
      return null
    }

    const wizardData = wizardResult[0]
    return {
      wizardSessionId: wizardData.id,
      projectName: wizardData.project_name,
      gender: wizardData.gender,
      photos: wizardData.photos ? JSON.parse(wizardData.photos) : [],
    }
  } catch (error) {
    console.error("Get wizard data error:", error)
    return null
  }
}

export async function deleteWizardData(wizardSessionId: string, userEmail: string) {
  try {
    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${userEmail}
    `

    if (userResult.length === 0) {
      throw new Error("User not found")
    }

    const userId = userResult[0].id

    // Delete wizard session
    await sql`
      DELETE FROM wizard_sessions 
      WHERE id = ${wizardSessionId} AND user_id = ${userId}
    `

    return true
  } catch (error) {
    console.error("Delete wizard data error:", error)
    return false
  }
}
