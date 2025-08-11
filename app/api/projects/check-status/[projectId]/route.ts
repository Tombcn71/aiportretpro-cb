import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = resolvedParams.projectId

    // Get project from database
    const projectResult = await sql`
      SELECT * FROM projects WHERE id = ${projectId}
    `

    if (projectResult.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projectResult[0]

    // If project has a tune_id, check Astria for photos
    if (project.tune_id) {
      try {
        const promptsResponse = await fetch(`https://api.astria.ai/tunes/${project.tune_id}/prompts`, {
          headers: {
            Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
          },
        })

        if (promptsResponse.ok) {
          const promptsData = await promptsResponse.json()
          console.log(`📸 Found ${promptsData.length} prompts for project ${projectId}`)

          const allImageUrls: string[] = []

          for (const prompt of promptsData) {
            if (prompt.images && Array.isArray(prompt.images)) {
              for (const image of prompt.images) {
                if (image.url) {
                  allImageUrls.push(image.url)
                }
              }
            }
          }

          if (allImageUrls.length > 0) {
            // Update project with photos
            await sql`
              UPDATE projects 
              SET 
                generated_photos = ${allImageUrls},
                status = 'completed',
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ${projectId}
            `
            console.log(`✅ Updated project ${projectId} with ${allImageUrls.length} photos`)
            
            return NextResponse.json({
              status: "completed",
              photos: allImageUrls,
              photoCount: allImageUrls.length
            })
          }
        }
      } catch (error) {
        console.error("Error fetching from Astria:", error)
      }
    }

    // Return current project status
    return NextResponse.json({
      status: project.status,
      photos: project.generated_photos || [],
      photoCount: project.generated_photos?.length || 0
    })

  } catch (error) {
    console.error("Error checking project status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 