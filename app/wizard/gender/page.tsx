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

    // Load existing gender from sessionStorage
    const savedGender = sessionStorage.getItem("wizard_gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }
  }, [session, router])

  const handleNext = async () => {
    if (!selectedGender) return

    setIsLoading(true)

    try {
      // Save to sessionStorage
      sessionStorage.setItem("wizard_gender", selectedGender)

      // Navigate to upload
      router.push("/wizard/upload")
    } catch (error) {
      console.error("Error saving gender:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const genderOptions = [
    { value: "man", label: "Man", icon: "👨" },
    { value: "vrouw", label: "Vrouw", icon: "👩" },
    { value: "unisex", label: "Unisex", icon: "👤" },
  ]

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Selecteer je geslacht</CardTitle>
          <Progress value={50} className="w-full mt-4" style={{ backgroundColor: "#e5e7eb" }}>
            <div
              className="h-full transition-all duration-300 ease-in-out rounded-full"
              style={{
                width: "50%",
                backgroundColor: "#0077B5",
              }}
            />
          </Progress>
          <p className="text-sm text-gray-600 mt-2">Stap 2 van 4</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGender(option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                  selectedGender === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium text-gray-900">{option.label}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedGender || isLoading}
            className="w-full"
            style={{ backgroundColor: "#0077B5" }}
          >
            {isLoading ? "Bezig..." : "Volgende"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
