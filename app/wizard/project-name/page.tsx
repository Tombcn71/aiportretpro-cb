"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

export default function WizardProjectNamePage() {
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
    const existingName = localStorage.getItem("wizard_project_name")
    if (existingName) {
      setProjectName(existingName)
    }
  }, [session, status, router])

  const handleContinue = () => {
    if (!projectName.trim()) return

    setLoading(true)
    localStorage.setItem("wizard_project_name", projectName.trim())
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Geef je project een naam</CardTitle>
          <p className="text-gray-600 mt-2">Dit helpt je om je headshots later terug te vinden</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project naam</Label>
            <Input
              id="projectName"
              type="text"
              placeholder="Bijv. LinkedIn Profiel 2024"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && projectName.trim()) {
                  handleContinue()
                }
              }}
              className="text-lg py-3"
            />
          </div>

          <Button
            onClick={handleContinue}
            disabled={!projectName.trim() || loading}
            className="w-full bg-[#0077B5] hover:bg-[#005885] text-white py-3"
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                Doorgaan
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-8 h-1 bg-[#0077B5] rounded"></div>
              <div className="w-8 h-1 bg-gray-300 rounded"></div>
              <div className="w-8 h-1 bg-gray-300 rounded"></div>
              <div className="w-8 h-1 bg-gray-300 rounded"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Stap 1 van 4</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
