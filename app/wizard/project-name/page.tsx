"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react"

export default function ProjectNamePage() {
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
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")
    if (!wizardSessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Load existing project name if available
    const savedProjectName = sessionStorage.getItem("projectName")
    if (savedProjectName) {
      setProjectName(savedProjectName)
    }
  }, [session, status, router])

  const handleNext = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    try {
      // Save to sessionStorage
      sessionStorage.setItem("projectName", projectName.trim())

      // Save to database
      const wizardSessionId = sessionStorage.getItem("wizardSessionId")
      if (wizardSessionId) {
        await fetch("/api/wizard/save-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wizardSessionId,
            projectName: projectName.trim(),
          }),
        })
      }

      router.push("/wizard/gender")
    } catch (error) {
      console.error("Error saving project name:", error)
      // Continue anyway with sessionStorage
      router.push("/wizard/gender")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/welcome")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Project Naam</CardTitle>
            <p className="text-gray-600 mt-2">Geef je AI headshot project een naam</p>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Stap 1 van 3</span>
                <span>33%</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                Project Naam
              </Label>
              <Input
                id="projectName"
                type="text"
                placeholder="Bijv. LinkedIn Headshots 2025"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="h-12 text-lg"
                maxLength={50}
                autoFocus
              />
              <p className="text-xs text-gray-500">Dit helpt je om je project later terug te vinden</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 h-12 bg-transparent"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!projectName.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Volgende
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
