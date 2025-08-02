import { type NextRequest, NextResponse } from "next/server"
import { saveWizardData } from "../../webhook/stripe/route"

// Re-export functions for compatibility
export { getWizardData, deleteWizardData } from "../../webhook/stripe/route"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length || 0,
      userEmail,
    })

    if (!sessionId || !projectName || !gender || !userEmail) {
      console.error("❌ Missing required wizard data")
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Save to in-memory storage
    saveWizardData(sessionId, {
      projectName,
      gender,
      uploadedPhotos: uploadedPhotos || [],
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
