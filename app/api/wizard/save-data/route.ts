import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// In-memory fallback storage
const wizardDataStore = new Map<string, any>()

export function saveWizardData(sessionId: string, data: any) {
  wizardDataStore.set(sessionId, data)
}

export function getWizardData(sessionId: string) {
  return wizardDataStore.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardDataStore.delete(sessionId)
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    if (!sessionId || !projectName || !gender || !uploadedPhotos) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos.length,
    })

    const wizardData = {
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
    }

    // Save to memory first
    saveWizardData(sessionId, wizardData)

    // Try to save to database
    try {
      await sql`
        INSERT INTO wizard_sessions (session_id, project_name, gender, uploaded_photos, user_email, created_at)
        VALUES (${sessionId}, ${projectName}, ${gender}, ${uploadedPhotos}, ${userEmail || ""}, NOW())
        ON CONFLICT (session_id) 
        DO UPDATE SET 
          project_name = ${projectName},
          gender = ${gender},
          uploaded_photos = ${uploadedPhotos},
          user_email = ${userEmail || ""},
          updated_at = NOW()
      `
      console.log("✅ Wizard data saved to database")
    } catch (dbError) {
      console.log("⚠️ Database save failed, using memory fallback:", dbError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Save wizard data error:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
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
    return NextResponse.json({ error: "Failed to get data" }, { status: 500 })
  }
}
