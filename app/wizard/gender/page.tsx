"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, User } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function GenderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState("")
  const [loading, setLoading] = useState(false)

  const genderOptions = [
    { id: "man", label: "Man", icon: User },
    { id: "woman", label: "Vrouw", icon: User },
    { id: "unisex", label: "Unisex", icon: User },
  ]

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Check if project name exists
    const projectName = localStorage.getItem("wizard_project_name")
    if (!projectName) {
      console.log("❌ No project name, redirecting to project-name")
      router.push("/wizard/project-name")
      return
    }

    // Load existing gender if available
    const savedGender = localStorage.getItem("wizard_gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }

    console.log("✅ Gender page loaded")
  }, [session, status, router])

  const handleNext = () => {
    if (!selectedGender) return

    setLoading(true)

    // Save to localStorage
    localStorage.setItem("wizard_gender", selectedGender)

    console.log("✅ Gender saved:", selectedGender)
    router.push("/wizard/upload")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={2} totalSteps={4} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Kies je geslacht</CardTitle>
            <p className="text-gray-600">Dit helpt ons om de juiste stijl en poses voor je headshots te kiezen.</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {genderOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedGender(option.id)}
                  className={`p-6 rounded-lg border-2 transition-all hover:border-blue-300 ${
                    selectedGender === option.id ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <option.icon
                      className={`w-12 h-12 ${selectedGender === option.id ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-lg font-medium ${
                        selectedGender === option.id ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/project-name")} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!selectedGender || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Volgende
                    <ArrowRight className="ml-2 h-4 w-4" />
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
