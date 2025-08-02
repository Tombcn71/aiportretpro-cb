import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@vercel/postgres"
import { createTuneWithPack } from "@/lib/astria"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { projectName, gender, uploadedPhotos, packId } = body

    console.log("🚀 Creating project with pack:", {
      projectName,
      gender,
      photosCount: uploadedPhotos?.length,
      packId,
      userEmail: session.user.email,
    })

    if (!projectName || !gender || !uploadedPhotos || !Array.isArray(uploadedPhotos)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user ID from email
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Create project in database
    const projectResult = await sql`
      INSERT INTO projects (
        user_id,
        name,
        gender,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        ${projectName},
        ${gender},
        'training',
        NOW(),
        NOW()
      ) RETURNING id
    `

    const projectId = projectResult.rows[0].id
    console.log("✅ Project created with ID:", projectId)

    // Start Astria training
    try {
      console.log("🎯 Starting Astria training...")
      const astriaResult = await createTuneWithPack({
        projectId,
        packId: packId || (gender === "man" ? "clkv6uxh40001l608ovk7lhpx" : "clkv6uy8g0003l608rk8d5vc6"),
        uploadedPhotos,
        projectName,
        gender,
      })

      console.log("✅ Astria training started:", astriaResult)

      // Update project with Astria details
      await sql`
        UPDATE projects 
        SET 
          tune_id = ${astriaResult.tune_id},
          astria_model_id = ${astriaResult.model_id},
          updated_at = NOW()
        WHERE id = ${projectId}
      `

      return NextResponse.json({
        success: true,
        projectId,
        tuneId: astriaResult.tune_id,
        modelId: astriaResult.model_id,
      })
    } catch (astriaError) {
      console.error("❌ Astria training failed:", astriaError)

      // Update project status to failed
      await sql`
        UPDATE projects 
        SET status = 'failed', updated_at = NOW()
        WHERE id = ${projectId}
      `

      return NextResponse.json(
        {
          error: "Failed to start AI training",
          projectId,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Error creating project with pack:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
