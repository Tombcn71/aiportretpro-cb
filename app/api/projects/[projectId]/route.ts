import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getProjectById, getUserByEmail } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const resolvedParams = await params
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Handle temporary project IDs
    if (resolvedParams.projectId === "temp" || resolvedParams.projectId.startsWith("temp_")) {
      return NextResponse.json({
        id: "temp",
        name: "Temporary Project",
        status: "pending",
        generated_photos: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id
      })
    }

    const project = await getProjectById(Number.parseInt(resolvedParams.projectId))
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if user owns this project
    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
