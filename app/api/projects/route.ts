import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getProjectsByUserId, getUserByEmail } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const projects = await getProjectsByUserId(user.id)

    // Format the projects for the frontend
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      created_at: project.created_at,
      generated_photos: project.generated_photos || [],
      gender: project.gender,
      prediction_id: project.prediction_id,
      updated_at: project.updated_at,
    }))

    console.log(`Returning ${formattedProjects.length} projects for user ${user.id}`)

    return NextResponse.json(formattedProjects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
