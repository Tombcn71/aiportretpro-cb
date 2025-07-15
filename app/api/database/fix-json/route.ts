import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    console.log("🔧 Starting JSON fix...")

    // First, let's see what we have
    const beforeFix = await sql`
      SELECT id, name, generated_photos
      FROM projects 
      WHERE id = 42
    `

    console.log("Before fix:", beforeFix[0]?.generated_photos)

    // Fix malformed JSON strings
    await sql`
      UPDATE projects 
      SET generated_photos = CASE
        -- If it's a malformed JSON string, try to parse it properly
        WHEN generated_photos::text LIKE '"\[%\]"' THEN
          -- This is a complex fix for double-escaped JSON
          (
            SELECT array_agg(trim(both '"' from unnest(string_to_array(
              replace(replace(replace(generated_photos::text, '\"[\"', ''), '\"]\"', ''), '\",\"', '|'),
              '|'
            ))))
          )
        ELSE generated_photos
      END
      WHERE generated_photos IS NOT NULL
        AND generated_photos::text LIKE '"\[%\]"'
    `

    // Check results
    const afterFix = await sql`
      SELECT id, name, 
             CASE 
               WHEN generated_photos IS NULL THEN 'NULL'
               WHEN array_length(generated_photos, 1) IS NULL THEN 'EMPTY ARRAY'
               ELSE array_length(generated_photos, 1)::text || ' photos'
             END as photo_count,
             generated_photos[1:3] as sample_photos
      FROM projects 
      WHERE generated_photos IS NOT NULL
      ORDER BY id
    `

    console.log("✅ JSON fix completed")

    return NextResponse.json({
      message: "JSON fix completed",
      beforeFix: beforeFix[0]?.generated_photos?.substring(0, 100) + "...",
      results: afterFix,
    })
  } catch (error) {
    console.error("❌ JSON fix error:", error)
    return NextResponse.json(
      {
        error: "JSON fix failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
