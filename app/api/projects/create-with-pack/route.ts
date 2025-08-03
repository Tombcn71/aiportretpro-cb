import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { projectName, gender, uploadedPhotos, userEmail } = await req.json()

    console.log("🚀 Creating project with pack:", {
      projectName,
      gender,
      photosCount: uploadedPhotos?.length,
      userEmail,
    })

    // Use pack 928 for all projects
    const packId = "928"
    const packName = gender === "man" ? "928 man" : "928 woman"

    // Create project in database
    const [project] = await sql`
      INSERT INTO projects (
        user_email,
        project_name,
        gender,
        uploaded_photos,
        pack_id,
        pack_name,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${userEmail},
        ${projectName},
        ${gender},
        ${uploadedPhotos},
        ${packId},
        ${packName},
        'pending',
        NOW(),
        NOW()
      )
      RETURNING *
    `

    console.log("✅ Project created:", project.id)

    return NextResponse.json({
      success: true,
      project: project,
      packId: packId,
    })
  } catch (error) {
    console.error("❌ Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
