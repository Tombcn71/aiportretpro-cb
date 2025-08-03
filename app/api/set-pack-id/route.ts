import { NextResponse } from "next/server"

export async function POST() {
  try {
    // This endpoint helps you verify the pack ID is being used correctly
    const packId = process.env.ASTRIA_PACK_ID || "928"

    return NextResponse.json({
      success: true,
      pack_id: packId,
      message: `Using pack ID: ${packId}`,
      note: "Pack ID 928 is now hardcoded as fallback in the system",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to set pack ID",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
