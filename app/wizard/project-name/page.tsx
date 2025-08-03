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

    // Load saved project name
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
      sessionStorage.setItem("wizard_projectName", projectName.trim())

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div className="bg-blue-500 h-2 transition-all duration-300 rounded-full" style={{ width: "25%" }}></div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Geef je project een naam</h1>
          <p className="text-gray-600">Kies een naam voor je AI headshot project</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="project-name" className="text-sm font-medium text-gray-700">
              Project naam
            </Label>
            <Input
              id="project-name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Bijv. Mijn professionele headshots"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Button
            onClick={handleNext}
            disabled={!projectName.trim() || isLoading}
            className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Bezig..." : "Volgende →"}
          </Button>
        </div>
      </div>
    </div>
  )
}
