import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

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

    saveWizardData(sessionId, {
      sessionId,
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
    })

    try {
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
