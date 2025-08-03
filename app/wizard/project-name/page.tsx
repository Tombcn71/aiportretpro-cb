"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?flow=wizard")
      return
    }

    // Load existing project name if available
    const savedName = sessionStorage.getItem("projectName")
    if (savedName) {
      setProjectName(savedName)
    }
  }, [session, status, router])

  const handleNext = () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    // Save to sessionStorage
    sessionStorage.setItem("projectName", projectName.trim())

    // Generate wizard session ID if not exists
    if (!sessionStorage.getItem("wizardSessionId")) {
      const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("wizardSessionId", wizardSessionId)
    }

    router.push("/wizard/gender")
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={25} className="w-full h-2" style={{ backgroundColor: "#e5e7eb" }}>
              <div
                className="h-full transition-all duration-300 ease-in-out rounded-full"
                style={{
                  width: "25%",
                  backgroundColor: "#0077B5",
                }}
              />
            </Progress>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Geef je project een naam</CardTitle>
          <p className="text-gray-600 mt-2">Stap 1 van 4: Kies een naam voor je AI headshot project</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
              Project naam
            </label>
            <Input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Bijvoorbeeld: LinkedIn Headshots"
              className="w-full"
              maxLength={50}
            />
            <p className="text-sm text-gray-500 mt-1">{projectName.length}/50 karakters</p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!projectName.trim() || isLoading}
            className="w-full text-lg py-3"
            style={{ backgroundColor: "#0077B5" }}
          >
            {isLoading ? "Bezig..." : "Volgende stap"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
