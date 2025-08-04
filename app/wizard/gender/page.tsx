"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, User } from "lucide-react"

export default function WizardGender() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState<"man" | "woman" | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    // Load existing wizard data
    const saved = localStorage.getItem("wizardData")
    if (saved) {
      const data = JSON.parse(saved)
      setWizardData(data)
      if (data.gender) {
        setSelectedGender(data.gender)
      }
    } else {
      // No wizard data found, redirect to start
      router.push("/wizard/welcome")
    }
  }, [router])

  const handleNext = async () => {
    if (!selectedGender) return

    setIsLoading(true)
    try {
      const updatedData = {
        ...wizardData,
        gender: selectedGender,
        step: 2,
      }

      localStorage.setItem("wizardData", JSON.stringify(updatedData))

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })

      router.push("/wizard/upload")
    } catch (error) {
      console.error("Error saving gender:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/project-name")
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-600">Stap 2 van 3</span>
            <span className="text-sm text-gray-500">Geslacht Selectie</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: "66%" }}></div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Selecteer je geslacht</CardTitle>
            <p className="text-gray-600 mt-2">Dit helpt onze AI om de beste headshots voor jou te genereren</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedGender("man")}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  selectedGender === "man"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      selectedGender === "man" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Man</h3>
                  <p className="text-sm text-gray-600 mt-1">Geoptimaliseerd voor mannelijke gezichtskenmerken</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedGender("woman")}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  selectedGender === "woman"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      selectedGender === "woman" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Vrouw</h3>
                  <p className="text-sm text-gray-600 mt-1">Geoptimaliseerd voor vrouwelijke gezichtskenmerken</p>
                </div>
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">ℹ️ Waarom vragen we dit?</h4>
              <p className="text-sm text-blue-700">
                Onze AI gebruikt verschillende modellen voor mannen en vrouwen om de meest realistische en professionele
                headshots te genereren die passen bij jouw gezichtsstructuur.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="flex items-center bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!selectedGender || isLoading}
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
