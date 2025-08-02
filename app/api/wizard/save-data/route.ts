import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { randomUUID } from "crypto"

// Tijdelijke opslag voor wizard data (in memory)
const wizardSessions = new Map<string, any>()

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const wizardData = await req.json()
    const sessionId = randomUUID()

    // Sla wizard data tijdelijk op met user email
    wizardSessions.set(sessionId, {
      ...wizardData,
      userEmail: session.user.email,
      createdAt: Date.now(),
    })

    console.log("💾 Wizard data saved with session ID:", sessionId)

    // Clean up old sessions (older than 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    for (const [key, value] of wizardSessions.entries()) {
      if (value.createdAt < oneHourAgo) {
        wizardSessions.delete(key)
      }
    }

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error("❌ Error saving wizard data:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}

// Export function to get wizard data
export function getWizardData(sessionId: string) {
  return wizardSessions.get(sessionId)
}

// Export function to delete wizard data
export function deleteWizardData(sessionId: string) {
  wizardSessions.delete(sessionId)
}
