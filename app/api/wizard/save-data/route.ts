import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for wizard data (temporary until checkout)
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

export async function POST(req: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    if (!sessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Save to memory temporarily
    saveWizardData(sessionId, {
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
    })

    console.log("✅ Wizard data saved for session:", sessionId)

    return NextResponse.json({ success: true, sessionId })
  } catch (error) {
    console.error("❌ Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
