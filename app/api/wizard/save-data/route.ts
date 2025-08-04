import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { projectName, gender, images, step } = data

    // Save or update wizard session
    await sql`
      INSERT INTO wizard_sessions (
        user_email, 
        project_name, 
        gender, 
        images, 
        step, 
        created_at, 
        updated_at
      ) VALUES (
        ${session.user.email}, 
        ${projectName || null}, 
        ${gender || null}, 
        ${images ? JSON.stringify(images) : null}, 
        ${step || 1}, 
        NOW(), 
        NOW()
      )
      ON CONFLICT (user_email) 
      DO UPDATE SET
        project_name = EXCLUDED.project_name,
        gender = EXCLUDED.gender,
        images = EXCLUDED.images,
        step = EXCLUDED.step,
        updated_at = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving wizard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT * FROM wizard_sessions 
      WHERE user_email = ${session.user.email}
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    return NextResponse.json({ data: result[0] || null })
  } catch (error) {
    console.error("Error getting wizard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await sql`
      DELETE FROM wizard_sessions 
      WHERE user_email = ${session.user.email}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting wizard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Named export for deleteWizardData function
export async function deleteWizardData(userEmail: string) {
  try {
    await sql`
      DELETE FROM wizard_sessions 
      WHERE user_email = ${userEmail}
    `
    return { success: true }
  } catch (error) {
    console.error("Error deleting wizard data:", error)
    return { success: false, error }
  }
}
