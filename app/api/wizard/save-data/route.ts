import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { step, data } = await request.json()

    if (!step || !data || !data.userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get or create wizard session
    let sessionId: string

    const existingSessions = await sql`
      SELECT id FROM wizard_sessions 
      WHERE user_id = ${data.userId} 
      AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT 1
    `

    if (existingSessions.length > 0) {
      sessionId = existingSessions[0].id
    } else {
      const newSession = await sql`
        INSERT INTO wizard_sessions (user_id, status, created_at)
        VALUES (${data.userId}, 'active', NOW())
        RETURNING id
      `
      sessionId = newSession[0].id
    }

    // Update session data based on step
    switch (step) {
      case "welcome":
        await sql`
          UPDATE wizard_sessions 
          SET started_at = ${data.startedAt}
          WHERE id = ${sessionId}
        `
        break

      case "project-name":
        await sql`
          UPDATE wizard_sessions 
          SET project_name = ${data.projectName}
          WHERE id = ${sessionId}
        `
        break

      case "gender":
        await sql`
          UPDATE wizard_sessions 
          SET gender = ${data.gender}
          WHERE id = ${sessionId}
        `
        break

      case "upload":
        await sql`
          UPDATE wizard_sessions 
          SET uploaded_files = ${data.uploadedFiles}
          WHERE id = ${sessionId}
        `
        break

      default:
        return NextResponse.json({ error: "Invalid step" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      sessionId,
    })
  } catch (error) {
    console.error("Error saving wizard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
