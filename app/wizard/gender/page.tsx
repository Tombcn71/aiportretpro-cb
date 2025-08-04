"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, User, Users } from "lucide-react"

export default function WizardGender() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/gender")
      return
    }

    // Check if we have a wizard session
    const sessionId = localStorage.getItem("wizardSessionId")
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Load existing data if any
    const savedData = localStorage.getItem(`wizard_${sessionId}`)
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.gender) {
        setSelectedGender(data.gender)
      }
    }
  }, [session, status, router])

  const handleNext = async () => {
    if (!selectedGender) return

    setIsLoading(true)

    try {
      const sessionId = localStorage.getItem("wizardSessionId")
      if (!sessionId) {
        router.push("/wizard/welcome")
        return
      }

      // Save to localStorage
      const existingData = localStorage.getItem(`wizard_${sessionId}`)
      const wizardData = existingData ? JSON.parse(existingData) : {}
      wizardData.gender = selectedGender
      wizardData.userEmail = session?.user?.email
      localStorage.setItem(`wizard_${sessionId}`, JSON.stringify(wizardData))

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          gender: selectedGender,
          userEmail: session?.user?.email,
          ...wizardData,
        }),
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={handleBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex space-x-2">
              <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-8"></div>
          </div>

          <CardTitle className="text-2xl font-bold text-center text-gray-900">Stap 2: Geslacht</CardTitle>
          <p className="text-center text-gray-600">Selecteer je geslacht voor de beste AI-resultaten</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setSelectedGender("man")}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedGender === "man" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedGender === "man" ? "bg-orange-500" : "bg-gray-100"
                  }`}
                >
                  <User className={`w-6 h-6 ${selectedGender === "man" ? "text-white" : "text-gray-600"}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Man</h3>
                  <p className="text-sm text-gray-600">Mannelijke AI-headshots</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedGender("vrouw")}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedGender === "vrouw" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedGender === "vrouw" ? "bg-orange-500" : "bg-gray-100"
                  }`}
                >
                  <Users className={`w-6 h-6 ${selectedGender === "vrouw" ? "text-white" : "text-gray-600"}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Vrouw</h3>
                  <p className="text-sm text-gray-600">Vrouwelijke AI-headshots</p>
                </div>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Waarom is dit belangrijk?</h4>
            <p className="text-sm text-gray-600">
              Onze AI gebruikt verschillende modellen voor mannen en vrouwen om de meest natuurlijke en professionele
              resultaten te leveren.
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedGender || isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Opslaan...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Volgende Stap</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
