"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProcessingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [status, setStatus] = useState("Voorbereiden...")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!session?.user?.email) {
      router.push("/login")
      return
    }

    startProjectCreation()
  }, [session, router])

  const startProjectCreation = async () => {
    try {
      // Haal wizard data uit localStorage
      const projectName = localStorage.getItem("wizard_projectName")
      const gender = localStorage.getItem("wizard_gender")
      const uploadedPhotos = localStorage.getItem("wizard_uploadedPhotos")

      if (!projectName || !gender || !uploadedPhotos) {
        throw new Error("Wizard data niet gevonden")
      }

      setStatus("Project aanmaken...")
      setProgress(25)

      // Gebruik de bestaande werkende API
      const response = await fetch("/api/projects/create-with-pack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          gender,
          selectedPackId: "professional", // Gebruik bestaande pack
          uploadedPhotos: JSON.parse(uploadedPhotos),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Project aanmaken mislukt")
      }

      setStatus("Astria training gestart...")
      setProgress(75)

      // Ruim localStorage op
      localStorage.removeItem("wizard_projectName")
      localStorage.removeItem("wizard_gender")
      localStorage.removeItem("wizard_uploadedPhotos")

      setStatus("Voltooid! Doorsturen naar dashboard...")
      setProgress(100)

      // Wacht even en ga naar dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error creating project:", error)
      setStatus("Er ging iets mis")

      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Je headshots worden gemaakt!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">{status}</p>
          </div>

          <Progress value={progress} className="w-full" />

          <div className="text-sm text-gray-600 text-center">
            <p>Dit duurt ongeveer 10-15 minuten.</p>
            <p>Je krijgt een email wanneer je foto's klaar zijn!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
