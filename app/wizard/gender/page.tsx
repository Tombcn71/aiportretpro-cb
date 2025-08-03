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

  const handleBack = () => {
    router.push("/wizard/project-name")
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "50%" }}></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Back button */}
        <div className="p-4">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">1</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">What's your gender?</h1>
              <p className="text-gray-600 text-lg">
                We'd love to learn more about you! Help us generate perfect photos that reflect who you are.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: "man", label: "Man", icon: "♂" },
                { value: "vrouw", label: "Woman", icon: "♀" },
                { value: "anders", label: "Non Binary", icon: "⚧" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedGender(option.value)}
                  className={`p-6 border-2 rounded-lg transition-all duration-200 ${
                    selectedGender === option.value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-lg font-medium">{option.label}</span>
                    <div
                      className={`ml-auto w-5 h-5 rounded-full border-2 ${
                        selectedGender === option.value ? "border-orange-500 bg-orange-500" : "border-gray-300"
                      }`}
                    >
                      {selectedGender === option.value && (
                        <div className="w-full h-full rounded-full bg-orange-500"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-6 border-t bg-white">
          <Button
            onClick={handleNext}
            disabled={!selectedGender || isLoading}
            className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Bezig..." : "Volgende"}
          </Button>
        </div>
      </div>
    </div>
  )
}
