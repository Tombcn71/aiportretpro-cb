import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const projectId = Number.parseInt(params.projectId)
    const body = await req.json()

    console.log("🎨 Wizard prompt webhook for project:", projectId)
    console.log("📦 Prompt result:", JSON.stringify(body, null, 2))

    if (!body.data || !body.data.id) {
      console.error("❌ Invalid prompt webhook body")
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const promptId = body.data.id
    const status = body.data.status
    const images = body.data.images || []

    console.log("🖼️ Prompt ID:", promptId, "Status:", status, "Images:", images.length)

    // Import database functions
    const { sql, getProjectById, updateProjectWithGeneratedPhotos } = await import("@/lib/db")

    if (status === "succeeded" && images.length > 0) {
      // Get current project
      const project = await getProjectById(projectId)
      if (!project) {
        console.error("❌ Project not found:", projectId)
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      // Get current generated photos
      let currentPhotos = []
      try {
        currentPhotos = project.generated_photos ? JSON.parse(project.generated_photos) : []
      } catch (e) {
        console.log("📸 No existing photos, starting fresh")
        currentPhotos = []
      }

      // Add new images
      const newImages = images.map((img: any) => img.url).filter((url: string) => url)
      const allPhotos = [...currentPhotos, ...newImages]

      console.log(`📸 Adding ${newImages.length} new photos, total: ${allPhotos.length}`)

      // Update project with new photos
      await updateProjectWithGeneratedPhotos(projectId, allPhotos, "generating")

      // Check if we have enough photos (let's say 35+ is complete)
      if (allPhotos.length >= 35) {
        console.log("🎉 Project completed with", allPhotos.length, "photos")
        await updateProjectWithGeneratedPhotos(projectId, allPhotos, "completed")
      }
    } else if (status === "failed") {
      console.error("❌ Prompt failed:", promptId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Wizard prompt webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
