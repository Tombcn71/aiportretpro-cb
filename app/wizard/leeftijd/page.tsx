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

export default function LeeftijdPage() {
  const { data: session, status } = useSession()
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [selectedAge, setSelectedAge] = useState("")
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
      if (parsedData.characteristics?.age) {
        setSelectedAge(parsedData.characteristics.age)
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
        age: selectedAge,
      },
    }

    localStorage.setItem("wizardData", JSON.stringify(updatedData))
    router.push("/wizard/postuur")
  }

  const ageOptions = [
    { id: "18-20", label: "18-20 jaar" },
    { id: "21-24", label: "21-24 jaar" },
    { id: "25-29", label: "25-29 jaar" },
    { id: "30-40", label: "30-40 jaar" },
    { id: "41-50", label: "41-50 jaar" },
    { id: "51-65", label: "51-65 jaar" },
    { id: "65+", label: "65+ jaar" },
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
          <ProgressBar currentStep={3} totalSteps={9} className="bg-[#0077B5]" />
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Jouw Leeftijd</CardTitle>
            <p className="text-gray-600">Selecteer jouw leeftijdsgroep voor betere AI resultaten</p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ageOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedAge(option.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedAge === option.id
                      ? "border-[#0077B5] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  {selectedAge === option.id && (
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
            onClick={() => router.push("/wizard/gender")}
            className="px-8"
          >
            ← Terug
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedAge}
            className="bg-[#0077B5] hover:bg-[#004182] text-white px-8"
          >
            Doorgaan naar Postuur →
          </Button>
        </div>
      </div>
    </div>
  )
} 