import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for wizard sessions
const wizardSessions = new Map<string, any>()

export function saveWizardData(sessionId: string, data: any) {
  wizardSessions.set(sessionId, data)
  console.log("💾 Wizard data saved:", sessionId)
}

export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = body

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length || 0,
      userEmail,
    })

    if (!sessionId || !projectName || !gender || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    saveWizardData(sessionId, {
      projectName,
      gender,
      uploadedPhotos: uploadedPhotos || [],
      userEmail,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Save wizard data error:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}
