"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function GenderPage() {
  const [gender, setGender] = useState("")
  const [wizardData, setWizardData] = useState<any>({})
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("wizardData")
    if (data) {
      setWizardData(JSON.parse(data))
    }
  }, [])

  const handleNext = () => {
    if (gender) {
      const updatedData = { ...wizardData, gender }
      localStorage.setItem("wizardData", JSON.stringify(updatedData))
      router.push("/wizard/upload")
    }
  }

  const handleBack = () => {
    router.push("/wizard/project-name")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-600 h-2 w-2/4"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-8">
            ← Terug
          </button>

          <div className="text-center mb-8">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">What's your gender?</h1>
            <p className="text-gray-600 text-lg">
              We'd love to learn more about you! Help us generate perfect photos that reflect who you are.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-4xl mx-auto">
            <button
              onClick={() => setGender("man")}
              className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                gender === "man" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">♂</span>
                  <span className="text-lg font-medium">Man</span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    gender === "man" ? "border-orange-500 bg-orange-500" : "border-gray-300"
                  }`}
                >
                  {gender === "man" && <div className="w-full h-full rounded-full bg-orange-500"></div>}
                </div>
              </div>
            </button>

            <button
              onClick={() => setGender("woman")}
              className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                gender === "woman" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">♀</span>
                  <span className="text-lg font-medium">Vrouw</span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    gender === "woman" ? "border-orange-500 bg-orange-500" : "border-gray-300"
                  }`}
                >
                  {gender === "woman" && <div className="w-full h-full rounded-full bg-orange-500"></div>}
                </div>
              </div>
            </button>

            <button
              onClick={() => setGender("non-binary")}
              className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                gender === "non-binary" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚧</span>
                  <span className="text-lg font-medium">Anders</span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    gender === "non-binary" ? "border-orange-500 bg-orange-500" : "border-gray-300"
                  }`}
                >
                  {gender === "non-binary" && <div className="w-full h-full rounded-full bg-orange-500"></div>}
                </div>
              </div>
            </button>
          </div>

          <div className="text-center">
            <Button
              onClick={handleNext}
              disabled={!gender}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-12 rounded-lg font-medium text-lg"
            >
              Volgende →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
