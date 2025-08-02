"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2 } from "lucide-react"

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Verwerken van je betaling...")
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const processWizardOrder = async () => {
      try {
        // Stap 1: Betaling verwerkt
        setStatus("Betaling geverifieerd...")
        setProgress(20)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Stap 2: Haal wizard data op
        const projectName = localStorage.getItem("wizard_project_name")
        const gender = localStorage.getItem("wizard_gender")
        const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

        console.log("🧙‍♂️ Wizard data:", { projectName, gender, photosLength: uploadedPhotos?.length })

        if (!projectName || !gender || !uploadedPhotos) {
          throw new Error("Wizard data niet gevonden")
        }

        setStatus("Project wordt aangemaakt...")
        setProgress(40)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Stap 3: Gebruik de BESTAANDE werkende API
        const response = await fetch("/api/projects/create-with-pack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName,
            gender,
            selectedPackId: "clx1qvimu0001hf0jdn5xdlr4", // Professional pack
            uploadedPhotos: JSON.parse(uploadedPhotos),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to create project")
        }

        const result = await response.json()
        console.log("✅ Project created:", result)

        setStatus("AI training gestart...")
        setProgress(80)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setStatus("Voltooid! Je wordt doorgestuurd...")
        setProgress(100)
        setIsComplete(true)

        // Clear wizard data
        localStorage.removeItem("wizard_project_name")
        localStorage.removeItem("wizard_gender")
        localStorage.removeItem("wizard_uploaded_photos")

        await new Promise((resolve) => setTimeout(resolve, 2000))
        router.push("/dashboard")
      } catch (error) {
        console.error("❌ Error processing wizard order:", error)
        setStatus("Er is een fout opgetreden. Je wordt doorgestuurd...")
        setTimeout(() => router.push("/dashboard"), 3000)
      }
    }

    processWizardOrder()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {isComplete ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isComplete ? "Bestelling Voltooid!" : "Bezig met verwerken..."}
            </h1>
            <p className="text-gray-600 mb-6">{status}</p>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">
              {isComplete ? "Je AI headshots worden gegenereerd..." : "Even geduld..."}
            </p>
          </div>

          {isComplete && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                Je project is aangemaakt en de AI training is gestart. Je ontvangt een email wanneer je headshots klaar
                zijn (ongeveer 15-20 minuten).
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
