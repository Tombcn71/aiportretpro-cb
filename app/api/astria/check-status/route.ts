import { NextResponse } from "next/server"
import axios from "axios"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    if (!process.env.ASTRIA_API_KEY) {
      return NextResponse.json({ error: "ASTRIA_API_KEY not configured" }, { status: 500 })
    }

    console.log("🔍 Checking all projects with Astria...")

    // Get all projects that are training/processing but have no photos
    const projects = await sql`
      SELECT id, name, prediction_id, status, created_at
      FROM projects 
      WHERE prediction_id IS NOT NULL 
      AND (generated_photos IS NULL OR array_length(generated_photos, 1) = 0)
      AND status IN ('training', 'processing')
      ORDER BY created_at DESC
    `

    console.log(`Found ${projects.length} projects to check`)

    const results = []

    for (const project of projects) {
      try {
        console.log(`Checking project ${project.id} with Astria ID ${project.prediction_id}`)

        // Check tune status - handle 404 errors gracefully
        let tuneData = null
        try {
          const tuneResponse = await axios.get(`https://api.astria.ai/tunes/${project.prediction_id}`, {
            headers: {
              Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
            },
          })
          tuneData = tuneResponse.data
          console.log(`Tune ${project.prediction_id} status:`, tuneData.status)
        } catch (tuneError) {
          if (axios.isAxiosError(tuneError) && tuneError.response?.status === 404) {
            console.log(`⚠️ Tune ${project.prediction_id} not found (404) - may have been deleted or invalid ID`)
            results.push({
              project_id: project.id,
              project_name: project.name,
              astria_id: project.prediction_id,
              error: "Tune not found (404) - ID may be invalid or deleted",
              recommendation: "This project cannot be recovered - create a new one",
            })
            continue
          } else {
            throw tuneError // Re-throw other errors
          }
        }

        // Check prompts for this tune
        let prompts = []
        try {
          const promptsResponse = await axios.get(`https://api.astria.ai/tunes/${project.prediction_id}/prompts`, {
            headers: {
              Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,
            },
          })
          prompts = promptsResponse.data
          console.log(`Found ${prompts.length} prompts for tune ${project.prediction_id}`)
        } catch (promptError) {
          if (axios.isAxiosError(promptError) && promptError.response?.status === 404) {
            console.log(`⚠️ No prompts found for tune ${project.prediction_id}`)
            prompts = []
          } else {
            throw promptError
          }
        }

        // Collect all images from all prompts
        const allImages = []
        for (const prompt of prompts) {
          if (prompt.images && prompt.images.length > 0) {
            allImages.push(...prompt.images)
          }
        }

        console.log(`Total images found: ${allImages.length}`)

        if (allImages.length > 0) {
          // Update project with found images
          await sql`
            UPDATE projects 
            SET generated_photos = ${allImages}, status = 'completed', updated_at = CURRENT_TIMESTAMP
            WHERE id = ${project.id}
          `
          console.log(`✅ Updated project ${project.id} with ${allImages.length} images`)
        }

        results.push({
          project_id: project.id,
          project_name: project.name,
          astria_id: project.prediction_id,
          tune_status: tuneData?.status || "unknown",
          prompts_count: prompts.length,
          images_found: allImages.length,
          updated: allImages.length > 0,
        })
      } catch (error) {
        console.error(`Error checking project ${project.id}:`, error)
        results.push({
          project_id: project.id,
          project_name: project.name,
          astria_id: project.prediction_id,
          error: axios.isAxiosError(error)
            ? `${error.response?.status}: ${error.response?.statusText || error.message}`
            : error.message,
        })
      }
    }

    return NextResponse.json({
      checked_projects: projects.length,
      results,
      summary: {
        total_checked: results.length,
        updated_projects: results.filter((r) => r.updated).length,
        total_images_recovered: results.reduce((sum, r) => sum + (r.images_found || 0), 0),
        projects_with_errors: results.filter((r) => r.error).length,
        not_found_projects: results.filter((r) => r.error?.includes("404")).length,
      },
    })
  } catch (error) {
    console.error("Error in status check:", error)
    return NextResponse.json(
      {
        error: "Status check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
