"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"

const projectSuggestions = [
  "LinkedIn Profiel",
  "CV Foto",
  "Website Portret",
  "Zakelijke Foto",
  "Social Media",
  "Bedrijfsprofiel",
  "Professional Headshot",
  "Corporate Foto",
]

export default function WizardProjectNamePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/wizard/login")
    }
  }, [status, router])

  const handleNext = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: "project-name",
          data: {
            projectName: projectName.trim(),
            userId: session?.user?.email,
          },
        }),
      })

      if (response.ok) {
        router.push("/wizard/gender")
      }
    } catch (error) {
      console.error("Error saving project name:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/welcome")
  }

  const handleSuggestionClick = (suggestion: string) => {
    setProjectName(suggestion)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Progress value={33} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">Stap 1 van 3</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Geef je project een naam</h1>

          <p className="text-lg text-gray-600 mb-8 text-center">
            Dit helpt ons je foto's te organiseren en maakt het makkelijker om ze later terug te vinden.
          </p>

          {/* Input Field */}
          <div className="mb-6">
            <Label htmlFor="projectName" className="text-base font-medium text-gray-700 mb-2 block">
              Project naam
            </Label>
            <Input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Bijv. LinkedIn Profiel 2025"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-[#FF8C00] focus:ring-0"
              maxLength={50}
            />
            <p className="text-sm text-gray-500 mt-1">{projectName.length}/50 karakters</p>
          </div>

          {/* Suggestions */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">Populaire namen:</p>
            <div className="flex flex-wrap gap-2">
              {projectSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2 bg-gray-100 hover:bg-[#FF8C00] hover:text-white text-gray-700 rounded-full text-sm transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button onClick={handleBack} variant="outline" className="flex items-center gap-2 px-6 py-3 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Button>

            <Button
              onClick={handleNext}
              disabled={!projectName.trim() || isLoading}
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white px-8 py-3 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  Volgende
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
