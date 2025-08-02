import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@vercel/postgres"
import { createTuneWithPack } from "@/lib/astria"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await req.json()
    const { projectName, gender, uploadedPhotos, packId } = body

    console.log("🚀 Creating project with wizard data:", {
      projectName,
      gender,
      photoCount: uploadedPhotos?.length,
      packId,
    })

    if (!projectName || !gender || !uploadedPhotos || uploadedPhotos.length === 0) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Maak project aan in database
    const projectResult = await sql`
      INSERT INTO projects (
        user_email, 
        name, 
        gender, 
        status, 
        created_at,
        updated_at
      )
      VALUES (
        ${session.user.email}, 
        ${projectName}, 
        ${gender}, 
        'training',
        NOW(),
        NOW()
      )
      RETURNING id, name, gender, status
    `

    const project = projectResult.rows[0]
    console.log("✅ Project created:", project)

    // Start Astria training met pack
    console.log("🎯 Starting Astria training with pack:", packId)

    const astriaResult = await createTuneWithPack({
      projectId: project.id,
      userEmail: session.user.email,
      projectName: projectName,
      gender: gender,
      uploadedPhotos: uploadedPhotos,
      packId: packId || "professional",
    })

    console.log("🎨 Astria training started:", astriaResult)

    // Update project met Astria IDs
    await sql`
      UPDATE projects 
      SET 
        tune_id = ${astriaResult.tune_id},
        astria_model_id = ${astriaResult.model_id},
        updated_at = NOW()
      WHERE id = ${project.id}
    `

    console.log("✅ Project updated with Astria IDs")

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        tune_id: astriaResult.tune_id,
        astria_model_id: astriaResult.model_id,
      },
    })
  } catch (error) {
    console.error("❌ Error creating project with pack:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
