"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function GenderPage() {
  const [selectedGender, setSelectedGender] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?flow=wizard")
      return
    }

    // Check if project name exists
    const projectName = sessionStorage.getItem("projectName")
    if (!projectName) {
      router.push("/wizard/project-name")
      return
    }

    // Load existing gender if available
    const savedGender = sessionStorage.getItem("gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }
  }, [session, status, router])

  const handleNext = () => {
    if (!selectedGender) return

    setIsLoading(true)

    // Save to sessionStorage
    sessionStorage.setItem("gender", selectedGender)

    router.push("/wizard/upload")
  }

  const genderOptions = [
    { value: "man", label: "Man", emoji: "👨" },
    { value: "vrouw", label: "Vrouw", emoji: "👩" },
    { value: "unisex", label: "Unisex", emoji: "👤" },
  ]

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={50} className="w-full h-2" style={{ backgroundColor: "#e5e7eb" }}>
              <div
                className="h-full transition-all duration-300 ease-in-out rounded-full"
                style={{
                  width: "50%",
                  backgroundColor: "#0077B5",
                }}
              />
            </Progress>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Selecteer je geslacht</CardTitle>
          <p className="text-gray-600 mt-2">Stap 2 van 4: Dit helpt ons de juiste AI modellen te kiezen</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGender(option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedGender === option.value
                    ? "border-[#0077B5] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-lg font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.back()} className="flex-1">
              Vorige stap
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedGender || isLoading}
              className="flex-1 text-lg py-3"
              style={{ backgroundColor: "#0077B5" }}
            >
              {isLoading ? "Bezig..." : "Volgende stap"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
