"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function GenderPage() {
  const [selectedGender, setSelectedGender] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Check if project name exists
    const projectName = sessionStorage.getItem("wizard_projectName")
    if (!projectName) {
      router.push("/wizard/project-name")
      return
    }

    // Load existing gender from sessionStorage
    const savedGender = sessionStorage.getItem("wizard_gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }
  }, [session, router])

  const handleNext = async () => {
    if (!selectedGender) return

    setIsLoading(true)

    try {
      // Save to sessionStorage
      sessionStorage.setItem("wizard_gender", selectedGender)

      // Navigate to upload
      router.push("/wizard/upload")
    } catch (error) {
      console.error("Error saving gender:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const genderOptions = [
    { value: "man", label: "Man", icon: "♂" },
    { value: "vrouw", label: "Vrouw", icon: "♀" },
    { value: "anders", label: "Anders", icon: "⚬" },
  ]

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with progress */}
      <div className="bg-white">
        <div className="w-full bg-gray-200 h-2">
          <div className="bg-orange-500 h-2 transition-all duration-300" style={{ width: "50%" }}></div>
        </div>

        <div className="p-4 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="ml-auto">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">What's your gender?</h1>
            <p className="text-lg text-gray-600">
              We'd love to learn more about you! Help us generate perfect photos that reflect who you are.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGender(option.value)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                  selectedGender === option.value
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-lg font-medium text-gray-900">{option.label}</span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedGender === option.value ? "border-orange-500 bg-orange-500" : "border-gray-300"
                  }`}
                >
                  {selectedGender === option.value && (
                    <div className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          disabled={!selectedGender || isLoading}
          className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          {isLoading ? "Bezig..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}
