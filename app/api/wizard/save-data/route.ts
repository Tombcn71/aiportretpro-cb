import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

// In-memory storage for wizard sessions (fallback)
const wizardSessions = new Map<string, any>()

export function saveWizardData(sessionId: string, data: any) {
  wizardSessions.set(sessionId, data)
  console.log("💾 Wizard data saved to memory:", sessionId)
}

export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
  console.log("🗑️ Wizard data deleted from memory:", sessionId)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await request.json()

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      userEmail,
    })

    // Save to memory (fallback)
    saveWizardData(sessionId, {
      sessionId,
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
    })

    try {
      // Try to save to database
      await sql`
        INSERT INTO wizard_sessions (
          session_id, 
          user_email, 
          project_name, 
          gender, 
          uploaded_photos, 
          created_at
        ) VALUES (
          ${sessionId},
          ${userEmail},
          ${projectName},
          ${gender},
          ${JSON.stringify(uploadedPhotos)},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (session_id) 
        DO UPDATE SET
          project_name = EXCLUDED.project_name,
          gender = EXCLUDED.gender,
          uploaded_photos = EXCLUDED.uploaded_photos,
          updated_at = CURRENT_TIMESTAMP
      `
      console.log("✅ Wizard data saved to database")
    } catch (dbError) {
      console.log("⚠️ Database save failed, using memory storage:", dbError)
    }

    return NextResponse.json({
      success: true,
      sessionId,
      message: "Wizard data saved successfully",
    })
  } catch (error) {
    console.error("❌ Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Try memory first
    const memoryData = getWizardData(sessionId)
    if (memoryData) {
      return NextResponse.json({ success: true, data: memoryData })
    }

    // Try database
    try {
      const result = await sql`
        SELECT * FROM wizard_sessions WHERE session_id = ${sessionId}
      `

      if (result[0]) {
        const data = {
          sessionId: result[0].session_id,
          projectName: result[0].project_name,
          gender: result[0].gender,
          uploadedPhotos: JSON.parse(result[0].uploaded_photos || "[]"),
          userEmail: result[0].user_email,
        }
        return NextResponse.json({ success: true, data })
      }
    } catch (dbError) {
      console.log("⚠️ Database read failed:", dbError)
    }

    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  } catch (error) {
    console.error("❌ Error getting wizard data:", error)
    return NextResponse.json({ error: "Failed to get wizard data" }, { status: 500 })
  }
}
