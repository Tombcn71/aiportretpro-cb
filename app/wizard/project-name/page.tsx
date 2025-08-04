"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft } from "lucide-react"

export default function WizardProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Load existing data if available
    const savedData = localStorage.getItem("wizardData")
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.projectName) {
        setProjectName(data.projectName)
      }
    }
  }, [])

  const handleNext = () => {
    if (!projectName.trim()) return

    // Save data to localStorage
    const sessionId = localStorage.getItem("wizardSessionId")
    const existingData = localStorage.getItem("wizardData")
    const data = existingData ? JSON.parse(existingData) : {}

    const updatedData = {
      ...data,
      sessionId,
      projectName: projectName.trim(),
      step: "project-name",
    }

    localStorage.setItem("wizardData", JSON.stringify(updatedData))
    router.push("/wizard/gender")
  }

  const handleBack = () => {
    router.push("/wizard/welcome")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0077B5]">Stap 1 van 3</span>
            <span className="text-sm text-gray-500">Project Details</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#0077B5] h-2 rounded-full" style={{ width: "33%" }}></div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Geef je project een naam</CardTitle>
            <p className="text-gray-600">Kies een naam die je helpt dit project te herkennen</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-base font-medium">
                Project Naam
              </Label>
              <Input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Bijv. LinkedIn Profiel, CV Foto's, Bedrijfsprofiel..."
                className="text-lg py-3"
                maxLength={50}
              />
              <p className="text-sm text-gray-500">{projectName.length}/50 karakters</p>
            </div>

            {/* Examples */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Populaire project namen:</h3>
              <div className="flex flex-wrap gap-2">
                {["LinkedIn Profiel", "CV Foto's", "Bedrijfsprofiel", "Website Foto", "Social Media"].map((example) => (
                  <button
                    key={example}
                    onClick={() => setProjectName(example)}
                    className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-blue-50 hover:border-[#0077B5] transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="flex items-center bg-transparent">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!projectName.trim()}
                className="bg-[#0077B5] hover:bg-[#004182] text-white flex items-center"
              >
                Volgende
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
