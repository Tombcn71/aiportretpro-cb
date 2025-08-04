"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft } from "lucide-react"

export default function ProjectNamePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [loading, setLoading] = useState(false)
  const [wizardSessionId, setWizardSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/welcome")
      return
    }

    // Get wizard session ID
    const sessionId = sessionStorage.getItem("wizardSessionId")
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    setWizardSessionId(sessionId)

    // Load existing project name if any
    const savedProjectName = sessionStorage.getItem("projectName")
    if (savedProjectName) {
      setProjectName(savedProjectName)
    }
  }, [session, status, router])

  const handleNext = async () => {
    if (!projectName.trim() || !wizardSessionId) return

    setLoading(true)

    try {
      // Save project name to sessionStorage
      sessionStorage.setItem("projectName", projectName.trim())

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId,
          projectName: projectName.trim(),
        }),
      })

      console.log("✅ Project name saved:", projectName.trim())
      router.push("/wizard/gender")
    } catch (error) {
      console.error("Error saving project name:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/welcome")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={33} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">Stap 1 van 3</p>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Geef je project een naam</CardTitle>
            <p className="text-gray-600 mt-2">Kies een naam die je helpt dit project te herkennen</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                Project naam
              </Label>
              <Input
                id="projectName"
                type="text"
                placeholder="Bijv. LinkedIn Headshots 2025"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full"
                maxLength={50}
              />
              <p className="text-xs text-gray-500">{projectName.length}/50 karakters</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1 py-3 bg-transparent" disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>
              <Button
                onClick={handleNext}
                disabled={!projectName.trim() || loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white py-3"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Volgende
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">Ingelogd als {session.user?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
