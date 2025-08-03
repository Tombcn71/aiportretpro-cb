import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Simple in-memory storage for wizard data (fallback)
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { sessionId, projectName, gender, uploadedPhotos } = data

    if (!sessionId || !projectName || !gender || !uploadedPhotos) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Save to memory as fallback
    saveWizardData(sessionId, {
      projectName,
      gender,
      uploadedPhotos,
      userEmail: session.user.email,
    })

    return NextResponse.json({
      success: true,
      sessionId,
      message: "Wizard data saved successfully",
    })
  } catch (error) {
    console.error("Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}
