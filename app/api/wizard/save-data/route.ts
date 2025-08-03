import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// In-memory storage as fallback
const wizardSessions = new Map<string, any>()

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
  userEmail?: string
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await request.json()

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length || 0,
      userEmail,
    })

    const wizardData = {
      projectName: projectName || "",
      gender: gender || "",
      uploadedPhotos: uploadedPhotos || [],
      userEmail: userEmail || "",
      createdAt: new Date().toISOString(),
    }

    // Try database first
    try {
      // Convert array to PostgreSQL array format
      const photosArray = Array.isArray(uploadedPhotos) ? uploadedPhotos : []

      await sql`
        INSERT INTO wizard_sessions (session_id, project_name, gender, uploaded_photos, user_email, created_at, updated_at)
        VALUES (${sessionId}, ${projectName}, ${gender}, ${photosArray}, ${userEmail}, NOW(), NOW())
        ON CONFLICT (session_id) 
        DO UPDATE SET 
          project_name = ${projectName},
          gender = ${gender},
          uploaded_photos = ${photosArray},
          user_email = ${userEmail},
          updated_at = NOW()
      `
      console.log("✅ Wizard data saved to database")
    } catch (dbError) {
      console.log("⚠️ Database save failed, using memory storage:", dbError)
    }

    // Always save to memory as backup
    wizardSessions.set(sessionId, wizardData)
    console.log("✅ Wizard data saved to memory")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Save wizard data error:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
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
          uploadedPhotos: Array.isArray(row.uploaded_photos)
            ? row.uploaded_photos
            : JSON.parse(row.uploaded_photos || "[]"),
          userEmail: row.user_email,
        })
      }
    } catch (dbError) {
      console.log("⚠️ Database read failed, checking memory:", dbError)
    }

    // Fallback to memory
    const wizardData = wizardSessions.get(sessionId)
    if (wizardData) {
      return NextResponse.json(wizardData)
    }

    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  } catch (error) {
    console.error("❌ Get wizard data error:", error)
    return NextResponse.json({ error: "Failed to get wizard data" }, { status: 500 })
  }
}

// Export functions for use in other files
export function saveWizardData(sessionId: string, data: WizardData) {
  wizardSessions.set(sessionId, {
    ...data,
    createdAt: new Date().toISOString(),
  })
  console.log("✅ Wizard data saved to memory:", sessionId)
}

export function getWizardData(sessionId: string) {
  const data = wizardSessions.get(sessionId)
  console.log("📖 Getting wizard data for:", sessionId, data ? "found" : "not found")
  return data
}

export function deleteWizardData(sessionId: string) {
  const deleted = wizardSessions.delete(sessionId)
  console.log("🗑️ Deleted wizard data:", sessionId, deleted ? "success" : "not found")
  return deleted
}
