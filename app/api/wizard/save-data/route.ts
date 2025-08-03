import { NextResponse } from "next/server"

// In-memory storage for wizard data (temporary solution)
const wizardSessions = new Map<string, any>()

export async function POST(request: Request) {
  try {
    const { sessionId, data } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Store wizard data
    wizardSessions.set(sessionId, {
      ...data,
      updatedAt: new Date().toISOString(),
    })

    console.log("Wizard data saved for session:", sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const data = wizardSessions.get(sessionId)

    if (!data) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error retrieving wizard data:", error)
    return NextResponse.json({ error: "Failed to retrieve data" }, { status: 500 })
  }
}

// Export functions for use in other parts of the app
export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

export function deleteWizardData(sessionId: string) {
  return wizardSessions.delete(sessionId)
}
