"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function WizardProjectName() {
  const { data: session } = useSession()
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)
    try {
      // Save project name to localStorage and database
      const wizardData = {
        projectName: projectName.trim(),
        step: 1,
      }

      localStorage.setItem("wizardData", JSON.stringify(wizardData))

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wizardData),
      })

      router.push("/wizard/gender")
    } catch (error) {
      console.error("Error saving project name:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/welcome")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-600">Stap 1 van 3</span>
            <span className="text-sm text-gray-500">Project Details</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: "33%" }}></div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Geef je project een naam</CardTitle>
            <p className="text-gray-600 mt-2">Kies een naam die je helpt dit project te herkennen</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-base font-medium">
                Project Naam
              </Label>
              <Input
                id="projectName"
                type="text"
                placeholder="Bijv. Mijn LinkedIn Foto's"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="text-lg py-3"
                maxLength={50}
              />
              <p className="text-sm text-gray-500">{projectName.length}/50 karakters</p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">💡 Tips voor een goede naam:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Gebruik het doel: "LinkedIn Headshots"</li>
                <li>• Voeg de datum toe: "Headshots December 2024"</li>
                <li>• Houd het kort en herkenbaar</li>
              </ul>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="flex items-center bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!projectName.trim() || isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Opslaan...
                  </>
                ) : (
                  <>
                    Volgende Stap
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
