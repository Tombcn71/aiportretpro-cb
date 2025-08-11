import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check if Vercel Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error: "Blob storage not configured. Please add BLOB_READ_WRITE_TOKEN environment variable.",
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (120MB limit)
    if (file.size > 120 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 120MB" }, { status: 400 })
    }

    // Import Vercel Blob dynamically
    const { put } = await import("@vercel/blob")

    // Generate a unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log("File uploaded successfully:", blob.url)
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error uploading file:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("No token found")) {
        return NextResponse.json(
          {
            error: "Blob storage not configured properly. Please configure BLOB_READ_WRITE_TOKEN.",
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
