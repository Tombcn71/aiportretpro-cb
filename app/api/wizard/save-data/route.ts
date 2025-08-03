import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { saveWizardData } from "../../stripe/create-checkout/route"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { sessionId, projectName, gender, uploadedPhotos, userEmail } = await req.json()

    if (!sessionId || !projectName || !gender || !uploadedPhotos || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("💾 Saving wizard data:", {
      sessionId,
      projectName,
      gender,
      photoCount: uploadedPhotos.length,
      userEmail,
    })

    // Save to database
    try {
      await sql`
        INSERT INTO wizard_sessions (session_id, project_name, gender, uploaded_photos, user_email, created_at)
        VALUES (${sessionId}, ${projectName}, ${gender}, ${uploadedPhotos}, ${userEmail}, NOW())
        ON CONFLICT (session_id) 
        DO UPDATE SET 
          project_name = ${projectName},
          gender = ${gender},
          uploaded_photos = ${uploadedPhotos},
          user_email = ${userEmail},
          updated_at = NOW()
      `
      console.log("✅ Wizard data saved to database")
    } catch (dbError) {
      console.error("⚠️ Database save failed, using memory fallback:", dbError)
    }

    // Also save to memory as fallback
    saveWizardData(sessionId, {
      projectName,
      gender,
      uploadedPhotos,
      userEmail,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Save wizard data error:", error)
    return NextResponse.json({ error: "Failed to save wizard data" }, { status: 500 })
  }
}
