import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for wizard data
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
    const { sessionId, data } = await req.json()

    if (!sessionId || !data) {
      return NextResponse.json({ error: "Missing sessionId or data" }, { status: 400 })
    }

    console.log("💾 Saving wizard data for session:", sessionId)
    saveWizardData(sessionId, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
    }

    const data = getWizardData(sessionId)

    if (!data) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error getting wizard data:", error)
    return NextResponse.json({ error: "Failed to get wizard data" }, { status: 500 })
  }
}
