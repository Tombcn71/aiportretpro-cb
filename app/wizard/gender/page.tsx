"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, User, Users } from "lucide-react"

export default function GenderPage() {
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

    // Check if we have a wizard session and project name
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")

    if (!wizardSessionId || !projectName) {
      router.push("/wizard/welcome")
      return
    }

    // Load existing gender if available
    const savedGender = sessionStorage.getItem("gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }
  }, [session, status, router])

  const handleNext = async () => {
    if (!selectedGender) return

    setIsLoading(true)

    try {
      // Save to sessionStorage
      sessionStorage.setItem("gender", selectedGender)

      // Save to database
      const wizardSessionId = sessionStorage.getItem("wizardSessionId")
      const projectName = sessionStorage.getItem("projectName")

      if (wizardSessionId) {
        await fetch("/api/wizard/save-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wizardSessionId,
            projectName,
            gender: selectedGender,
          }),
        })
      }

      router.push("/wizard/upload")
    } catch (error) {
      console.error("Error saving gender:", error)
      // Continue anyway with sessionStorage
      router.push("/wizard/upload")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/project-name")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Geslacht</CardTitle>
            <p className="text-gray-600 mt-2">Kies je geslacht voor de beste AI resultaten</p>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Stap 2 van 3</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <button
                onClick={() => setSelectedGender("man")}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedGender === "man"
                    ? "border-orange-500 bg-orange-50 shadow-lg"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
                }`}
              >
                <div className="flex items-center justify-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedGender === "man" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-gray-900">Man</h3>
                    <p className="text-sm text-gray-600">Mannelijke AI headshots</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedGender("vrouw")}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedGender === "vrouw"
                    ? "border-orange-500 bg-orange-50 shadow-lg"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
                }`}
              >
                <div className="flex items-center justify-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedGender === "vrouw" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-gray-900">Vrouw</h3>
                    <p className="text-sm text-gray-600">Vrouwelijke AI headshots</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> De AI gebruikt deze informatie om de meest geschikte professionele stijlen en
                poses te selecteren.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 h-12 bg-transparent"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!selectedGender || isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Volgende
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
