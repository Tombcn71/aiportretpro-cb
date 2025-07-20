"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function GenderPage() {
  const [selectedGender, setSelectedGender] = useState("")
  const router = useRouter()

  const handleContinue = () => {
    if (selectedGender) {
      const existingData = JSON.parse(localStorage.getItem("wizardData") || "{}")
      localStorage.setItem(
        "wizardData",
        JSON.stringify({
          ...existingData,
          gender: selectedGender,
          // Set default values for outfit and background since we're skipping those steps
          outfits: ["business-professional"], // Default outfit
          backgrounds: ["office"], // Default background
        }),
      )
      // Skip outfit and background steps, go directly to upload
      router.push("/wizard/upload")
    }
  }

  const genderOptions = [
    { id: "man", label: "Man", icon: User },
    { id: "woman", label: "Vrouw", icon: User },
    { id: "non-binary", label: "Unisex", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <ProgressBar currentStep={2} totalSteps={3} />
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Type fotoshoot?</CardTitle>
            <p className="text-gray-600">
              Dit helpt ons de perfecte professionele portetfotos te genereren met de juiste portetfotos
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {genderOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedGender(option.id)}
                    className={`p-6 rounded-lg border-2 transition-all text-center ${
                      selectedGender === option.id
                        ? "border-[#0077B5] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <div className="font-medium">{option.label}</div>
                    {selectedGender === option.id && (
                      <div className="w-4 h-4 bg-[#0077B5] rounded-full mx-auto mt-2"></div>
                    )}
                  </button>
                )
              })}
            </div>
            <Button
              onClick={handleContinue}
              disabled={!selectedGender}
              className="w-full bg-[#0077B5] hover:bg-[#004182] text-white"
            >
              Doorgaan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
