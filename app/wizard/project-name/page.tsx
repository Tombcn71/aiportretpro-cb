"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Load existing project name from sessionStorage
    const savedName = sessionStorage.getItem("wizard_projectName")
    if (savedName) {
      setProjectName(savedName)
    }
  }, [session, router])

  const handleNext = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    try {
      // Save to sessionStorage
      sessionStorage.setItem("wizard_projectName", projectName)

      // Navigate to gender selection
      router.push("/wizard/gender")
    } catch (error) {
      console.error("Error saving project name:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "25%" }}></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Geef je project een naam</h1>
            <p className="text-gray-600">Dit helpt ons je project te organiseren</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                Project naam
              </Label>
              <Input
                id="projectName"
                type="text"
                placeholder="Bijv. Mijn professionele headshots"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full mt-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">{projectName.length}/50 karakters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          disabled={!projectName.trim() || isLoading}
          className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          {isLoading ? "Bezig..." : "Volgende"}
        </Button>
      </div>
    </div>
  )
}
