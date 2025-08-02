"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, Upload, User, Camera } from "lucide-react"

export default function ProcessingPage() {
  const [step, setStep] = useState(1)
  const [projectId, setProjectId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if we have wizard data
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")
    const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

    if (projectName && gender && uploadedPhotos) {
      console.log("🧙‍♂️ Found wizard data, creating project...")
      createWizardProject()
    } else {
      console.log("❌ No wizard data found, redirecting to dashboard")
      setTimeout(() => router.push("/dashboard"), 2000)
    }
  }, [])

  const createWizardProject = async () => {
    try {
      const projectName = localStorage.getItem("wizard_project_name")
      const gender = localStorage.getItem("wizard_gender")
      const uploadedPhotos = JSON.parse(localStorage.getItem("wizard_uploaded_photos") || "[]")

      console.log("📝 Creating project with wizard data:", { projectName, gender, uploadedPhotos })

      setStep(2)

      const response = await fetch("/api/projects/create-with-pack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          gender,
          uploadedPhotos,
          packId: "clx1qvimu0001hf0jdn5xdlr4", // Default pack
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const result = await response.json()
      console.log("✅ Project created:", result)

      setProjectId(result.projectId)
      setStep(3)

      // Clear wizard data
      localStorage.removeItem("wizard_project_name")
      localStorage.removeItem("wizard_gender")
      localStorage.removeItem("wizard_uploaded_photos")

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("❌ Error creating wizard project:", error)
      setStep(4) // Error state
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {step === 1 && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-[#0077B5] mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Betaling Verwerkt!</h2>
              <p className="text-gray-600">We verwerken je wizard gegevens...</p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-green-500 mr-2" />
                <Upload className="h-6 w-6 text-green-500 mr-2" />
                <Loader2 className="h-6 w-6 animate-spin text-[#0077B5]" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Project Aanmaken...</h2>
              <p className="text-gray-600">We maken je project aan met je geüploade foto's</p>
            </>
          )}

          {step === 3 && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Training Gestart!</h2>
              <p className="text-gray-600 mb-4">Je AI model wordt getraind. Dit duurt ongeveer 15 minuten.</p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Camera className="h-4 w-4 mr-1" />
                Project ID: {projectId}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-xl">!</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Er ging iets mis</h2>
              <p className="text-gray-600 mb-4">
                We konden je project niet aanmaken. Geen zorgen, je betaling is verwerkt.
              </p>
              <Button onClick={() => router.push("/dashboard")} className="bg-[#0077B5] hover:bg-[#004182]">
                Ga naar Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
