import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Simple in-memory storage
const wizardSessions = new Map<string, any>()

export function saveWizardData(sessionId: string, data: any) {
  wizardSessions.set(sessionId, data)
  console.log("💾 Saved wizard data:", sessionId)
}

export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, ...data } = await req.json()
    saveWizardData(sessionId, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Save error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    // Try database first
    try {
      const result = await sql`
        SELECT * FROM wizard_sessions WHERE session_id = ${sessionId}
      `
      if (result.length > 0) {
        const row = result[0]
        return NextResponse.json({
          projectName: row.project_name,
          gender: row.gender,
          uploadedPhotos: row.uploaded_photos,
          userEmail: row.user_email,
        })
      }
    } catch (dbError) {
      console.log("⚠️ Database read failed, checking memory:", dbError)
    }

    // Fallback to memory
    const data = getWizardData(sessionId)
    if (data) {
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  } catch (error) {
    console.error("❌ Get wizard data error:", error)
    return NextResponse.json({ error: "Failed to get wizard data" }, { status: 500 })
  }
}
