import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createProject, getUserByEmail } from "@/lib/db"
import { CreditManager } from "@/lib/credits"
import { generateWithSelectedPack } from "@/lib/astria"

export async function POST(request: NextRequest) {
  try {
    console.log("Creating project with credit...")

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { projectName, gender, uploadedPhotos } = data

    // Validate required fields
    if (!projectName || !gender || !uploadedPhotos || uploadedPhotos.length < 4) {
      return NextResponse.json(
        {
          error: "Missing required fields or insufficient photos",
        },
        { status: 400 },
      )
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has credits
    const availableCredits = await CreditManager.getUserCredits(user.id)
    if (availableCredits < 1) {
      return NextResponse.json(
        {
          error: "Insufficient credits. Please purchase credits to continue.",
        },
        { status: 400 },
      )
    }

    // Create project
    const project = await createProject({
      userId: user.id,
      purchaseId: 1, // Not needed for credit system
      name: projectName,
      gender,
      outfits: [], // Not used with pack system
      backgrounds: [], // Not used with pack system
      uploadedPhotos,
    })

    // Generate with pack 928
    const astriaResponse = await generateWithSelectedPack({
      packId: "928",
      images: uploadedPhotos,
      projectName,
      gender,
      projectId: project.id,
    })

    console.log("Project created and generation started:", {
      projectId: project.id,
      astriaId: astriaResponse.id,
    })

    await CreditManager.useCredit(user.id, project.id)

    return NextResponse.json({
      projectId: project.id,
      message: "Project created and generation started",
    })
  } catch (error) {
    console.error("Error creating project with credit:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
