import { type NextRequest, NextResponse } from "next/server"

// Fallback upload that converts images to base64 data URLs
// This is for testing when Vercel Blob is not configured
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (10MB limit for base64)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large for fallback method. Maximum size is 10MB" }, { status: 400 })
    }

    // Convert to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    console.log("File converted to base64 data URL")
    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error("Error in fallback upload:", error)
    return NextResponse.json(
      {
        error: "Fallback upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
