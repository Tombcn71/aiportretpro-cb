// Fetch and analyze the database CSV to understand the data structure
async function analyzeDatabase() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/projects-OcrqXcMkgmR5gsKt2WrFRUiFl6L9Jh.csv",
    )
    const csvText = await response.text()

    console.log("CSV Data Sample:")
    console.log(csvText.substring(0, 1000))

    // Parse CSV manually to understand structure
    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    console.log("\nHeaders:", headers)

    if (lines.length > 1) {
      const firstDataRow = lines[1]
      console.log("\nFirst data row:", firstDataRow)

      // Try to parse the generated_photos field
      const columns = firstDataRow.split(",")
      const generatedPhotosIndex = headers.indexOf("generated_photos")

      if (generatedPhotosIndex !== -1 && columns[generatedPhotosIndex]) {
        console.log("\nGenerated photos field:", columns[generatedPhotosIndex])

        try {
          const parsed = JSON.parse(columns[generatedPhotosIndex])
          console.log("Parsed as JSON:", Array.isArray(parsed), parsed.length)
        } catch (e) {
          console.log("Not valid JSON:", e.message)
        }
      }
    }

    return { success: true, headers, sampleData: lines.slice(0, 3) }
  } catch (error) {
    console.error("Error analyzing database:", error)
    return { success: false, error: error.message }
  }
}

// Run the analysis
analyzeDatabase().then((result) => {
  console.log("Analysis complete:", result)
})
