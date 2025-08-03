import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = body

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photosCount: uploadedPhotos?.length,
      userEmail,
    })

    if (!sessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Save to database
    await sql`
      INSERT INTO wizard_sessions (
        session_id,
        user_email,
        project_name,
        gender,
        uploaded_photos,
        completed,
        created_at,
        updated_at
      ) VALUES (
        ${sessionId},
        ${userEmail},
        ${projectName},
        ${gender},
        ${uploadedPhotos},
        false,
        NOW(),
        NOW()
      )
      ON CONFLICT (session_id) DO UPDATE SET
        project_name = ${projectName},
        gender = ${gender},
        uploaded_photos = ${uploadedPhotos},
        updated_at = NOW()
    `

    // Also save to memory as fallback
    saveWizardData(sessionId, {
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
    })

    console.log("✅ Wizard data saved to database and memory")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
