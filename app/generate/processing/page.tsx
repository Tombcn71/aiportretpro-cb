"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Verwerken van je betaling...")
  const router = useRouter()

  useEffect(() => {
    const processWizardData = async () => {
      try {
        console.log("🔄 Starting processing...")

        // Haal wizard data uit localStorage
        const projectName = localStorage.getItem("wizard_project_name")
        const gender = localStorage.getItem("wizard_gender")
        const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

        console.log("🧙‍♂️ Retrieved wizard data:", { projectName, gender, photosLength: uploadedPhotos?.length })

        if (!projectName || !gender || !uploadedPhotos) {
          console.error("❌ Geen wizard data gevonden")
          router.push("/dashboard")
          return
        }

        const data = {
          projectName,
          gender,
          uploadedPhotos: JSON.parse(uploadedPhotos),
        }

        setStatus("Project aanmaken...")
        setProgress(25)

        console.log("📡 Calling create-with-pack API...")

        // Maak project aan met wizard data
        const response = await fetch("/api/projects/create-with-pack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName: data.projectName,
            gender: data.gender,
            selectedPackId: "clx1qvimu0001hf0jdn5xdlr4", // Professional pack ID
            uploadedPhotos: data.uploadedPhotos,
          }),
        })

        console.log("📡 API response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ API error:", errorText)
          throw new Error(`API failed: ${response.status}`)
        }

        const result = await response.json()
        console.log("✅ Project created:", result)

        setStatus("AI training starten...")
        setProgress(50)

        // Wacht even voor de training te starten
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setStatus("Training gestart! Je foto's worden gegenereerd...")
        setProgress(75)

        // Wacht nog even
        await new Promise((resolve) => setTimeout(resolve, 2000))

        setStatus("Doorsturen naar dashboard...")
        setProgress(100)

        // Clear wizard data
        localStorage.removeItem("wizard_project_name")
        localStorage.removeItem("wizard_gender")
        localStorage.removeItem("wizard_uploaded_photos")

        console.log("🧹 Wizard data cleared")

        // Ga naar dashboard
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("🏠 Redirecting to dashboard...")
        router.push("/dashboard")
      } catch (error) {
        console.error("❌ Error processing wizard data:", error)
        setStatus("Er is een fout opgetreden. Je wordt doorgestuurd...")
        setTimeout(() => router.push("/dashboard"), 3000)
      }
    }

    processWizardData()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bezig met verwerken...</h1>
            <p className="text-gray-600 mb-6">{status}</p>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">Dit kan een paar minuten duren</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
