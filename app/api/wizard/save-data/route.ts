import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for wizard data (temporary solution)
const wizardDataStore = new Map<string, any>()

export function saveWizardData(sessionId: string, data: any) {
  wizardDataStore.set(sessionId, data)
  console.log("💾 Saved wizard data to memory:", sessionId)
}

export function getWizardData(sessionId: string) {
  const data = wizardDataStore.get(sessionId)
  console.log("📖 Getting wizard data:", sessionId, data ? "found" : "not found")
  return data
}

export function deleteWizardData(sessionId: string) {
  const deleted = wizardDataStore.delete(sessionId)
  console.log("🗑️ Deleted wizard data:", sessionId, deleted ? "success" : "not found")
  return deleted
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await request.json()

    if (!sessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const wizardData = {
      sessionId,
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
      timestamp: new Date().toISOString(),
    }

    saveWizardData(sessionId, wizardData)

    return NextResponse.json({ success: true, message: "Wizard data saved" })
  } catch (error) {
    console.error("❌ Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}
