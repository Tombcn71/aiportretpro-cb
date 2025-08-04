"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function WizardProjectName() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/project-name")
      return
    }

    // Check if we have a wizard session
    const sessionId = localStorage.getItem("wizardSessionId")
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Load existing data if any
    const savedData = localStorage.getItem(`wizard_${sessionId}`)
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.projectName) {
        setProjectName(data.projectName)
      }
    }
  }, [session, status, router])

  const handleNext = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    try {
      const sessionId = localStorage.getItem("wizardSessionId")
      if (!sessionId) {
        router.push("/wizard/welcome")
        return
      }

      // Save to localStorage
      const existingData = localStorage.getItem(`wizard_${sessionId}`)
      const wizardData = existingData ? JSON.parse(existingData) : {}
      wizardData.projectName = projectName.trim()
      wizardData.userEmail = session?.user?.email
      localStorage.setItem(`wizard_${sessionId}`, JSON.stringify(wizardData))

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          projectName: projectName.trim(),
          userEmail: session?.user?.email,
          ...wizardData,
        }),
      })

      router.push("/wizard/gender")
    } catch (error) {
      console.error("Error saving project name:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/welcome")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex space-x-2">
              <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-8"></div>
          </div>

          <CardTitle className="text-2xl font-bold text-center text-gray-900">Stap 1: Project Naam</CardTitle>
          <p className="text-center text-gray-600">Geef je AI headshot project een naam</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
              Project Naam
            </Label>
            <Input
              id="projectName"
              type="text"
              placeholder="Bijv. Mijn Professionele Headshots"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full"
              maxLength={50}
            />
            <p className="text-xs text-gray-500">{projectName.length}/50 karakters</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Tip:</h4>
            <p className="text-sm text-gray-600">
              Kies een naam die je helpt dit project later terug te vinden, zoals "LinkedIn Foto's 2024" of "Zakelijke
              Headshots".
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!projectName.trim() || isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Opslaan...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Volgende Stap</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
