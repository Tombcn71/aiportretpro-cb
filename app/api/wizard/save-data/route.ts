import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for wizard sessions
const wizardSessions = new Map<
  string,
  {
    projectName: string
    gender: string
    uploadedPhotos: string[]
    timestamp: number
  }
>()

// Clean up old sessions (older than 1 hour)
function cleanupOldSessions() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  for (const [sessionId, data] of wizardSessions.entries()) {
    if (data.timestamp < oneHourAgo) {
      wizardSessions.delete(sessionId)
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos } = await req.json()

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length || 0,
    })

    // Clean up old sessions
    cleanupOldSessions()

    // Save wizard data
    wizardSessions.set(sessionId, {
      projectName,
      gender,
      uploadedPhotos,
      timestamp: Date.now(),
    })

    console.log("✅ Wizard data saved for session:", sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Save data error:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}

// Helper functions for other files to access wizard data
export function getWizardData(sessionId: string) {
  cleanupOldSessions()
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
}
