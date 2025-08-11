import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateWithExistingModel, getAstriaModelStatus } from "@/lib/astria"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tuneId, projectId, gender } = await request.json()

    if (!tuneId || !projectId) {
      return NextResponse.json({ error: "Missing tuneId or projectId" }, { status: 400 })
    }

    // Check if the model is trained and ready
    const modelStatus = await getAstriaModelStatus(tuneId.toString())
    if (modelStatus.trained_at === null) {
      return NextResponse.json({ error: "Model is not trained yet" }, { status: 400 })
    }

    console.log("Using existing model:", tuneId, "for project:", projectId)

    // Update project status
    await sql`
      UPDATE projects 
      SET prediction_id = ${tuneId.toString()}, status = 'processing'
      WHERE id = ${projectId}
    `

    // Generate headshots with existing model
    const prompts = [
      `professional headshot of ohwx ${gender}, business suit, clean white background, corporate photography, high quality, detailed, professional lighting, 8k resolution`,
      `linkedin profile picture of ohwx ${gender}, professional attire, office background, business casual, corporate headshot, professional photography, high resolution`,
      `portrait of ohwx ${gender} in business casual attire, professional headshot, neutral background, corporate style, high quality photography, detailed`,
    ]

    await generateWithExistingModel({
      tuneId: Number.parseInt(tuneId),
      prompts,
      userId: 1, // You might want to get the actual user ID
      modelId: projectId,
    })

    return NextResponse.json({
      success: true,
      message: "Started generation with existing model",
      tuneId,
      projectId,
    })
  } catch (error) {
    console.error("Error using existing model:", error)
    return NextResponse.json(
      {
        error: "Failed to use existing model",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
