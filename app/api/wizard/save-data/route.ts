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
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photosCount: uploadedPhotos?.length,
      userEmail,
    })

    const wizardData = {
      sessionId,
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
      createdAt: new Date().toISOString(),
    }

    saveWizardData(sessionId, wizardData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}
