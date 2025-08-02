"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function GenderPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedGender, setSelectedGender] = useState("")
  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    // Check if we have project name from previous step
    const savedProjectName = localStorage.getItem("wizard_project_name")
    if (!savedProjectName) {
      router.push("/wizard/project-name")
      return
    }

    setProjectName(savedProjectName)
    console.log("📋 Loaded project name:", savedProjectName)
  }, [session, router])

  const handleNext = () => {
    if (!selectedGender) return

    // Save gender to localStorage
    localStorage.setItem("wizard_gender", selectedGender)
    console.log("💾 Saved gender:", selectedGender)

    router.push("/wizard/upload")
  }

  const genderOptions = [
    { value: "man", label: "Man", icon: "👨" },
    { value: "woman", label: "Woman", icon: "👩" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/wizard/project-name")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex space-x-2">
                <div className="h-2 bg-blue-600 rounded-full flex-1"></div>
                <div className="h-2 bg-blue-600 rounded-full flex-1"></div>
                <div className="h-2 bg-gray-200 rounded-full flex-1"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Step 2 of 3</p>
            </div>
          </div>
          <CardTitle className="text-2xl">Select your gender</CardTitle>
          <p className="text-gray-600">This helps us choose the right AI model for you</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedGender(option.value)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedGender === option.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-4xl mb-2">{option.icon}</div>
                <div className="font-medium">{option.label}</div>
              </button>
            ))}
          </div>

          <Button onClick={handleNext} disabled={!selectedGender} className="w-full">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
