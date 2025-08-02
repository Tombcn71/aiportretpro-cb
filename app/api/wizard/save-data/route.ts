import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for wizard sessions
const wizardSessions = new Map<string, any>()

export function setWizardData(sessionId: string, data: any) {
  wizardSessions.set(sessionId, data)
  console.log("💾 Wizard data saved in memory:", sessionId, data)
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
      photoCount: uploadedPhotos.length,
      userEmail,
    })

    if (!sessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      console.error("❌ Missing required wizard data")
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Store wizard data in memory
    setWizardData(sessionId, {
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
      timestamp: Date.now(),
    })

    console.log("✅ Wizard data saved successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}

// Export the functions so they can be imported by the webhook
export { wizardSessions }
