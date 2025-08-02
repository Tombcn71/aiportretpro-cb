import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for wizard sessions - SHARED WITH WEBHOOK
const wizardSessions = new Map<string, any>()

export function getWizardData(sessionId: string) {
  const data = wizardSessions.get(sessionId)
  console.log("📖 Getting wizard data for session:", sessionId, !!data)
  return data
}

export function setWizardData(sessionId: string, data: any) {
  console.log("💾 Setting wizard data for session:", sessionId, data)
  wizardSessions.set(sessionId, data)
}

export function deleteWizardData(sessionId: string) {
  console.log("🗑️ Deleting wizard data for session:", sessionId)
  wizardSessions.delete(sessionId)
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    console.log("💾 SAVING WIZARD DATA:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      userEmail,
      photos: uploadedPhotos,
    })

    if (!sessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      console.error("❌ Missing required wizard data")
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Store wizard data in memory for webhook to retrieve
    setWizardData(sessionId, {
      projectName,
      gender,
      uploadedPhotos, // VERCEL BLOB URLS FROM UPLOAD API
      userEmail,
      timestamp: Date.now(),
    })

    console.log("✅ WIZARD DATA SAVED SUCCESSFULLY - READY FOR WEBHOOK")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ ERROR SAVING WIZARD DATA:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
