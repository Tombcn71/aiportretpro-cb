"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function GenderPage() {
  const [selectedGender, setSelectedGender] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we have wizard data
    const wizardData = sessionStorage.getItem("wizardData")
    if (!wizardData) {
      router.push("/wizard/project-name")
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGender) return

    setIsLoading(true)

    // Update sessionStorage
    const existingData = JSON.parse(sessionStorage.getItem("wizardData") || "{}")
    sessionStorage.setItem(
      "wizardData",
      JSON.stringify({
        ...existingData,
        gender: selectedGender,
        step: 2,
      }),
    )

    router.push("/wizard/upload")
  }

  const genderOptions = [
    { value: "man", label: "Man", icon: "👨" },
    { value: "vrouw", label: "Vrouw", icon: "👩" },
    { value: "unisex", label: "Unisex", icon: "👤" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
          <CardTitle className="text-2xl font-bold text-gray-900">Selecteer geslacht</CardTitle>
          <p className="text-gray-600 mt-2">Stap 2 van 4: Dit helpt ons de beste AI modellen te selecteren</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-3">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedGender(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedGender === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <Button
              type="submit"
              disabled={!selectedGender || isLoading}
              className="w-full"
              style={{ backgroundColor: "#0077B5" }}
            >
              {isLoading ? "Bezig..." : "Volgende stap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
