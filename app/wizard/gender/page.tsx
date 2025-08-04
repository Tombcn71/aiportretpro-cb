"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, User, Users } from "lucide-react"

export default function WizardGenderPage() {
  const [selectedGender, setSelectedGender] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Load existing data if available
    const savedData = localStorage.getItem("wizardData")
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.gender) {
        setSelectedGender(data.gender)
      }
    }
  }, [])

  const handleNext = () => {
    if (!selectedGender) return

    // Save data to localStorage
    const existingData = localStorage.getItem("wizardData")
    const data = existingData ? JSON.parse(existingData) : {}

    const updatedData = {
      ...data,
      gender: selectedGender,
      step: "gender",
    }

    localStorage.setItem("wizardData", JSON.stringify(updatedData))
    router.push("/wizard/upload")
  }

  const handleBack = () => {
    router.push("/wizard/project-name")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0077B5]">Stap 2 van 3</span>
            <span className="text-sm text-gray-500">Geslacht Selectie</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#0077B5] h-2 rounded-full" style={{ width: "66%" }}></div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Selecteer je geslacht</CardTitle>
            <p className="text-gray-600">Dit helpt ons de beste AI modellen voor je te selecteren</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Male Option */}
              <button
                onClick={() => setSelectedGender("man")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedGender === "man" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedGender === "man" ? "bg-[#0077B5] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <User className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Man</h3>
                    <p className="text-sm text-gray-600">Mannelijke AI portretten</p>
                  </div>
                </div>
              </button>

              {/* Female Option */}
              <button
                onClick={() => setSelectedGender("vrouw")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedGender === "vrouw" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedGender === "vrouw" ? "bg-[#0077B5] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Vrouw</h3>
                    <p className="text-sm text-gray-600">Vrouwelijke AI portretten</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Waarom vragen we dit?</strong> Onze AI gebruikt verschillende modellen voor mannen en vrouwen om
                de meest realistische en professionele resultaten te leveren.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="flex items-center bg-transparent">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!selectedGender}
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
