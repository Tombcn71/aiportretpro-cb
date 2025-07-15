import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { createTuneWithPack } from "@/lib/astria"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectName, gender, imageUrls } = await request.json()

    console.log("🎯 Creating project with credit:", {
      projectName,
      gender,
      imageCount: imageUrls?.length,
      userEmail: session.user.email,
    })

    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE email = ${session.user.email}
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userResult[0]
    console.log("👤 User found:", { id: user.id })

    // Check credits in separate credits table
    const creditsResult = await sql`
      SELECT credits FROM credits WHERE user_id = ${user.id}
    `

    const currentCredits = creditsResult[0]?.credits || 0
    console.log("💳 Current credits:", currentCredits)

    if (currentCredits < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    // Create project in database with credits_used = 1
    const projectResult = await sql`
      INSERT INTO projects (
        user_id, 
        name, 
        gender, 
        uploaded_photos, 
        status, 
        credits_used,
        created_at, 
        updated_at
      )
      VALUES (
        ${user.id}, 
        ${projectName}, 
        ${gender}, 
        ${imageUrls}, 
        'training', 
        1,
        NOW(), 
        NOW()
      )
      RETURNING id, name, gender, status, credits_used
    `

    const project = projectResult[0]
    console.log("📦 Project created:", project)

    // Deduct credit from credits table
    await sql`
      UPDATE credits 
      SET credits = credits - 1, updated_at = NOW()
      WHERE user_id = ${user.id}
    `

    console.log("💳 Credit deducted from credits table")

    // Create tune with Astria using pack 928
    const packId = "928"
    const tuneResult = await createTuneWithPack(packId, {
      title: projectName,
      name: `project_${project.id}_${Date.now()}`,
      imageUrls: imageUrls,
      projectId: project.id,
      userId: user.id,
    })

    console.log("🎨 Astria tune created:", tuneResult)

    // Update project with tune_id
    await sql`
      UPDATE projects 
      SET tune_id = ${tuneResult.id}, updated_at = NOW()
      WHERE id = ${project.id}
    `

    console.log("✅ Project updated with tune_id:", tuneResult.id)

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        tuneId: tuneResult.id,
        creditsUsed: project.credits_used,
      },
      message: "Project created successfully with credit",
    })
  } catch (error) {
    console.error("❌ Create with credit error:", error)
    return NextResponse.json(
      {
        error: "Failed to create project with credit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
