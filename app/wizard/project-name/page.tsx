"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNext = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    // Save to sessionStorage
    sessionStorage.setItem("projectName", projectName)

    // Navigate to gender selection
    router.push("/wizard/gender")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "25%" }}></div>
      </div>

      <div className="flex items-center justify-center min-h-[90vh] px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Wat is de naam van je project?</h1>
              <p className="text-gray-600">Geef je fotoshoot een naam zodat je het later makkelijk kunt terugvinden.</p>
            </div>

            <div className="space-y-6">
              <div className="text-left">
                <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                  Project naam
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Bijv. LinkedIn Headshots"
                  className="mt-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && projectName.trim()) {
                      handleNext()
                    }
                  }}
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!projectName.trim() || isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
              >
                {isLoading ? "Bezig..." : "Volgende →"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
