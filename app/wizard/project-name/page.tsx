"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function ProjectNamePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Generate session ID if not exists
    if (!sessionStorage.getItem("wizardSessionId")) {
      const sessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("wizardSessionId", sessionId)
    }

    // Load existing project name if available
    const savedName = sessionStorage.getItem("projectName")
    if (savedName) {
      setProjectName(savedName)
    }
  }, [session, status, router])

  const handleNext = () => {
    if (projectName.trim()) {
      sessionStorage.setItem("projectName", projectName.trim())
      console.log("✅ Project name saved:", projectName.trim())
      router.push("/wizard/gender")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={1} totalSteps={3} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Geef je project een naam</CardTitle>
            <p className="text-gray-600">
              Kies een naam voor je headshot project. Dit helpt je later om je foto's terug te vinden.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project naam</Label>
              <Input
                id="projectName"
                type="text"
                placeholder="Bijv. LinkedIn Headshots, Zakelijke Foto's, ..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-lg py-3"
                maxLength={50}
              />
              <p className="text-sm text-gray-500">{projectName.length}/50 karakters</p>
            </div>

            <Button
              onClick={handleNext}
              disabled={!projectName.trim()}
              className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-3 text-lg"
            >
              Volgende stap
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
