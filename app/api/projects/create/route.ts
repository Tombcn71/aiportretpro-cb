import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createProject, getUserByEmail, sql } from "@/lib/db"
import { generateWithSelectedPack } from "@/lib/astria"

export async function POST(request: NextRequest) {
  try {
    console.log("Creating new project with Astria...")

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log("No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Project data received:", {
      projectName: data.projectName,
      gender: data.gender,
      outfits: data.outfits,
      backgrounds: data.backgrounds,
      photoCount: data.uploadedPhotos?.length,
      firstPhotoPreview: data.uploadedPhotos?.[0]?.substring(0, 50) + "...",
    })

    const { projectName, gender, outfits, backgrounds, uploadedPhotos } = data

    // Validate required fields
    if (!projectName || !gender || !uploadedPhotos) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!uploadedPhotos || uploadedPhotos.length < 4) {
      return NextResponse.json(
        {
          error: `At least 4 photos are required for Astria training. You provided ${uploadedPhotos?.length || 0} photos.`,
        },
        { status: 400 },
      )
    }

    // Validate environment variables
    if (!process.env.ASTRIA_API_KEY) {
      return NextResponse.json({ error: "Astria API not configured" }, { status: 500 })
    }

    if (!process.env.APP_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      console.log("User not found:", session.user.email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Found user:", user.id)

    // Create project in database
    const project = await createProject({
      userId: user.id,
      purchaseId: 1, // You might want to get this from the session or purchase
      name: projectName,
      gender,
      outfits,
      backgrounds,
      uploadedPhotos,
    })

    console.log("Created project:", project.id)

    // Start Astria generation with pack 928
    try {
      console.log("Starting Astria generation...")
      const astriaResponse = await generateWithSelectedPack({
        packId: "928", // Default pack
        images: uploadedPhotos,
        projectName,
        gender,
        projectId: project.id,
      })

      console.log("Astria generation started successfully:", {
        tuneId: astriaResponse.id,
        status: astriaResponse.status,
        projectId: project.id,
      })

      // Update project with Astria tune ID
      await sql`
        UPDATE projects 
        SET prediction_id = ${astriaResponse.id.toString()}, status = 'training'
        WHERE id = ${project.id}
      `

      console.log("Updated project with Astria tune ID")

      return NextResponse.json({
        projectId: project.id,
        tuneId: astriaResponse.id,
        status: "training",
      })
    } catch (trainingError) {
      console.error("Failed to start Astria generation:", trainingError)

      // Update project status to failed
      await sql`
        UPDATE projects 
        SET status = 'failed'
        WHERE id = ${project.id}
      `

      // Provide more specific error message
      let errorMessage = "Failed to start AI generation"
      if (trainingError instanceof Error) {
        errorMessage = trainingError.message
      }

      return NextResponse.json(
        {
          error: errorMessage,
          projectId: project.id,
          details: trainingError instanceof Error ? trainingError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
