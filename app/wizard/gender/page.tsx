"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function GenderPage() {
  const [selectedGender, setSelectedGender] = useState("")
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

    // Load saved gender
    const savedGender = sessionStorage.getItem("wizard_gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }
  }, [session, router])

  const handleNext = () => {
    if (selectedGender) {
      sessionStorage.setItem("wizard_gender", selectedGender)
      router.push("/wizard/upload")
    }
  }

  const genderOptions = [
    { value: "man", label: "Man", icon: "♂" },
    { value: "vrouw", label: "Vrouw", icon: "♀" },
    { value: "anders", label: "Anders", icon: "⚧" },
  ]

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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Wat is je geslacht?</h1>
            <p className="text-gray-600">
              We willen meer over je leren! Help ons perfecte foto's te genereren die jou weerspiegelen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <div className="text-center">
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 mx-auto mt-3 ${
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
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t bg-white">
        <Button
          onClick={handleNext}
          disabled={!selectedGender}
          className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volgende →
        </Button>
      </div>
    </div>
  )
}
