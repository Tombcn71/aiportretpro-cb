"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function ProjectNamePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Load existing project name if available
    const savedName = localStorage.getItem("wizard_project_name")
    if (savedName) {
      setProjectName(savedName)
    }
  }, [session, status, router])

  const handleNext = () => {
    if (!projectName.trim()) return

    setLoading(true)

    // Save to localStorage
    localStorage.setItem("wizard_project_name", projectName.trim())

    // Navigate to gender selection
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={1} totalSteps={4} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Geef je project een naam</CardTitle>
            <p className="text-gray-600">Kies een naam zodat je je project makkelijk kunt terugvinden</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project naam</Label>
              <Input
                id="projectName"
                type="text"
                placeholder="Bijv. LinkedIn Headshots, CV Foto's, Bedrijfsprofiel"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-lg py-3"
                maxLength={50}
              />
              <p className="text-sm text-gray-500">{projectName.length}/50 karakters</p>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/welcome")} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!projectName.trim() || loading}
                className="bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                {loading ? "Bezig..." : "Volgende"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
