"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Header } from "@/components/header"

interface WizardData {
  projectName: string
  gender: string
  characteristics: {
    age: string
    eyeColor: string
    hairColor: string
    hairLength: string
    hairType: string
    bodyType: string
  }
}

export default function HaarlengtePage() {
  const { data: session, status } = useSession()
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [selectedHairLength, setSelectedHairLength] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    const savedData = localStorage.getItem("wizardData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setWizardData(parsedData)
      if (parsedData.characteristics?.hairLength) {
        setSelectedHairLength(parsedData.characteristics.hairLength)
      }
    } else {
      router.push("/wizard/welcome")
    }
  }, [status, router])

  const handleContinue = () => {
    if (!wizardData) return

    const updatedData = {
      ...wizardData,
      characteristics: {
        ...wizardData.characteristics,
        hairLength: selectedHairLength,
      },
    }

    localStorage.setItem("wizardData", JSON.stringify(updatedData))
    router.push("/wizard/haartype")
  }

  const hairLengthOptions = [
    { id: "kaal", label: "Kaal" },
    { id: "stekeltjes", label: "Stekeltjes" },
    { id: "kort", label: "Kort" },
    { id: "halflang", label: "Halflang" },
    { id: "lang", label: "Lang" },
  ]

  if (status === "loading" || !wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <ProgressBar currentStep={7} totalSteps={9} className="bg-[#0077B5]" />
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Jouw Haarlengte</CardTitle>
            <p className="text-gray-600">Selecteer jouw haarlengte voor betere AI resultaten</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hairLengthOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedHairLength(option.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedHairLength === option.id
                      ? "border-[#0077B5] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  {selectedHairLength === option.id && (
                    <div className="w-4 h-4 bg-[#0077B5] rounded-full mx-auto mt-2"></div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/wizard/haarkleur")}
            className="px-8"
          >
            ← Terug
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedHairLength}
            className="bg-[#0077B5] hover:bg-[#004182] text-white px-8"
          >
            Doorgaan naar Haartype →
          </Button>
        </div>
      </div>
    </div>
  )
} 