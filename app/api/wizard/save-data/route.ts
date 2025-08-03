import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// In-memory storage as fallback
const memoryStorage = new Map<string, any>()

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const wizardData = {
      session_id: sessionId,
      project_name: projectName,
      gender,
      uploaded_photos: JSON.stringify(uploadedPhotos),
      user_email: userEmail,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      userEmail,
    })

    try {
      // Try to save to database
      await sql`
        INSERT INTO wizard_sessions (session_id, project_name, gender, uploaded_photos, user_email, created_at, updated_at)
        VALUES (${sessionId}, ${projectName}, ${gender}, ${JSON.stringify(uploadedPhotos)}, ${userEmail}, NOW(), NOW())
        ON CONFLICT (session_id) 
        DO UPDATE SET 
          project_name = EXCLUDED.project_name,
          gender = EXCLUDED.gender,
          uploaded_photos = EXCLUDED.uploaded_photos,
          user_email = EXCLUDED.user_email,
          updated_at = NOW()
      `
      console.log("✅ Wizard data saved to database")
    } catch (dbError) {
      console.log("⚠️ Database save failed, using memory storage:", dbError)
      memoryStorage.set(sessionId, wizardData)
      console.log("✅ Wizard data saved to memory")
    }

    return NextResponse.json({ success: true, data: wizardData })
  } catch (error) {
    console.error("❌ Save wizard data error:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    console.log("📖 Getting wizard data for session:", sessionId)

    try {
      // Try to get from database
      const result = await sql`
        SELECT * FROM wizard_sessions WHERE session_id = ${sessionId}
      `

      if (result.length > 0) {
        const data = result[0]
        console.log("✅ Wizard data retrieved from database")
        return NextResponse.json({ success: true, data })
      }
    } catch (dbError) {
      console.log("⚠️ Database read failed, checking memory storage:", dbError)
    }

    // Fallback to memory storage
    const memoryData = memoryStorage.get(sessionId)
    if (memoryData) {
      console.log("✅ Wizard data retrieved from memory")
      return NextResponse.json({ success: true, data: memoryData })
    }

    console.log("❌ No wizard data found")
    return NextResponse.json({ error: "Wizard data not found" }, { status: 404 })
  } catch (error) {
    console.error("❌ Get wizard data error:", error)
    return NextResponse.json({ error: "Failed to get wizard data" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    console.log("🗑️ Deleting wizard data for session:", sessionId)

    try {
      // Try to delete from database
      await sql`DELETE FROM wizard_sessions WHERE session_id = ${sessionId}`
      console.log("✅ Wizard data deleted from database")
    } catch (dbError) {
      console.log("⚠️ Database delete failed:", dbError)
    }

    // Also delete from memory storage
    memoryStorage.delete(sessionId)
    console.log("✅ Wizard data deleted from memory")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Delete wizard data error:", error)
    return NextResponse.json({ error: "Failed to delete wizard data" }, { status: 500 })
  }
}

// Named exports for the missing functions
export const getWizardData = async (sessionId: string) => {
  try {
    const result = await sql`SELECT * FROM wizard_sessions WHERE session_id = ${sessionId}`
    return result.length > 0 ? result[0] : memoryStorage.get(sessionId)
  } catch (error) {
    return memoryStorage.get(sessionId)
  }
}

export const deleteWizardData = async (sessionId: string) => {
  try {
    await sql`DELETE FROM wizard_sessions WHERE session_id = ${sessionId}`
  } catch (error) {
    console.log("Database delete failed:", error)
  }
  memoryStorage.delete(sessionId)
}
