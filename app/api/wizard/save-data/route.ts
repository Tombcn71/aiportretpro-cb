import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// In-memory storage for wizard sessions (in production, use Redis or database)
const wizardSessions = new Map<string, any>()

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectName, gender, photos } = await req.json()

    // Generate unique session ID
    const sessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Store wizard data in memory
    wizardSessions.set(sessionId, {
      userEmail: session.user.email,
      projectName,
      gender,
      uploadedPhotos: photos,
      createdAt: new Date().toISOString(),
    })

    console.log("✅ Wizard data saved:", {
      sessionId,
      userEmail: session.user.email,
      projectName,
      gender,
      photoCount: photos.length,
    })

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error("Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}

// Export function to get wizard data (used by webhook)
export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
}
