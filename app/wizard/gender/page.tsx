"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, User, Users } from "lucide-react"

const genderOptions = [
  {
    id: "man",
    label: "Man",
    icon: User,
    description: "Mannelijke portretfoto's",
  },
  {
    id: "vrouw",
    label: "Vrouw",
    icon: User,
    description: "Vrouwelijke portretfoto's",
  },
  {
    id: "anders",
    label: "Anders",
    icon: Users,
    description: "Neutrale portretfoto's",
  },
]

export default function WizardGenderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/wizard/login")
    }
  }, [status, router])

  const handleNext = async () => {
    if (!selectedGender) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: "gender",
          data: {
            gender: selectedGender,
            userId: session?.user?.email,
          },
        }),
      })

      if (response.ok) {
        router.push("/wizard/upload")
      }
    } catch (error) {
      console.error("Error saving gender:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/project-name")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Progress value={67} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">Stap 2 van 3</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Selecteer je geslacht</h1>

          <p className="text-lg text-gray-600 mb-8 text-center">
            Dit helpt ons de juiste stijl en poses voor je portretfoto's te kiezen.
          </p>

          {/* Gender Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {genderOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedGender(option.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-center ${
                    selectedGender === option.id
                      ? "border-[#FF8C00] bg-[#FF8C00]/5 shadow-lg"
                      : "border-gray-200 hover:border-[#FF8C00]/50 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`p-4 rounded-full mb-4 ${
                        selectedGender === option.id ? "bg-[#FF8C00] text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button onClick={handleBack} variant="outline" className="flex items-center gap-2 px-6 py-3 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Button>

            <Button
              onClick={handleNext}
              disabled={!selectedGender || isLoading}
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white px-8 py-3 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  Volgende
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
