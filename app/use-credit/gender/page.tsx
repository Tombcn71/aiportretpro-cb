"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users } from "lucide-react"

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
          step: 2,
        }),
      )
      router.push("/use-credit/upload")
    }
  }

  const genderOptions = [
    { id: "man", label: "Man", icon: User },
    { id: "woman", label: "Vrouw", icon: User },
    { id: "unisex", label: "Unisex", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              ✓
            </div>
            <div className="w-8 h-1 bg-green-500 rounded"></div>
            <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
          </div>
          <CardTitle className="text-2xl">Type fotoshoot?</CardTitle>
          <p className="text-gray-600">Dit helpt ons de perfecte professionele portetfotos te genereren met de juiste portretfotos</p>
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

          <div className="space-y-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedGender}
              className="w-full bg-[#0077B5] hover:bg-[#004182] text-white"
            >
              Continue
            </Button>

            <Button variant="ghost" onClick={() => router.back()} className="w-full">
              ← Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
