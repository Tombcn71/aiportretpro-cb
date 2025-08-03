"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function GenderPage() {
  const [selectedGender, setSelectedGender] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNext = async () => {
    if (!selectedGender) return

    setIsLoading(true)

    // Save to sessionStorage
    sessionStorage.setItem("gender", selectedGender)

    // Navigate to upload
    router.push("/wizard/upload")
  }

  const genderOptions = [
    { value: "man", label: "Man", icon: "♂" },
    { value: "vrouw", label: "Vrouw", icon: "♀" },
    { value: "anders", label: "Anders", icon: "⚧" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "50%" }}></div>
      </div>

      <div className="flex items-center justify-center min-h-[90vh] px-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold text-lg">1</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">What's your gender?</h1>
              <p className="text-gray-600 text-lg">
                We'd love to learn more about you! Help us generate perfect photos that reflect who you are.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedGender(option.value)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                      selectedGender === option.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <span className="font-medium text-lg">{option.label}</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedGender === option.value ? "border-orange-500 bg-orange-500" : "border-gray-300"
                        }`}
                      >
                        {selectedGender === option.value && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!selectedGender || isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
              >
                {isLoading ? "Bezig..." : "Volgende →"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
