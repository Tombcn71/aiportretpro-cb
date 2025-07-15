import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, sql } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { projectId, dryRun = true } = await request.json()

    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get project info
    const project = await sql`
      SELECT id, name, status, credits_used, user_id 
      FROM projects 
      WHERE id = ${projectId} AND user_id = ${user.id}
    `

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Get user credits
    const creditResult = await sql`
      SELECT credits FROM credits WHERE user_id = ${user.id}
    `

    const currentCredits = creditResult[0]?.credits || 0
    const projectData = project[0]

    const analysis = {
      project: {
        id: projectData.id,
        name: projectData.name,
        status: projectData.status,
        currentCreditsUsed: projectData.credits_used || 0,
      },
      user: {
        currentCredits,
        canDeductCredit: currentCredits > 0,
      },
      actions: {
        shouldDeductCredit:
          projectData.credits_used === 0 && (projectData.status === "completed" || projectData.status === "trained"),
        dryRun,
      },
    }

    if (dryRun) {
      return NextResponse.json({
        message: "DRY RUN - No changes made",
        analysis,
        wouldDo: analysis.actions.shouldDeductCredit
          ? "Would deduct 1 credit and mark project as credits_used = 1"
          : "No changes needed",
      })
    }

    // Actually make the changes
    if (analysis.actions.shouldDeductCredit && analysis.user.canDeductCredit) {
      // Deduct credit from user
      await sql`
        UPDATE credits 
        SET credits = credits - 1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user.id}
      `

      // Mark project as using credit
      await sql`
        UPDATE projects 
        SET credits_used = 1
        WHERE id = ${projectId}
      `

      return NextResponse.json({
        message: "Credit successfully deducted",
        analysis,
        changes: {
          creditDeducted: 1,
          newCreditBalance: currentCredits - 1,
          projectMarked: true,
        },
      })
    }

    return NextResponse.json({
      message: "No changes made",
      analysis,
      reason: !analysis.actions.shouldDeductCredit
        ? "Project doesn't need credit deduction"
        : "User has no credits to deduct",
    })
  } catch (error) {
    console.error("Test credit fix error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
