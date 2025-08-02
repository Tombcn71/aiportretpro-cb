"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users, ArrowLeft, ArrowRight } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function GenderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Check previous step
    const projectName = localStorage.getItem("wizard_project_name")
    if (!projectName) {
      router.push("/wizard/project-name")
      return
    }

    // Load saved gender
    const saved = localStorage.getItem("wizard_gender")
    if (saved) {
      setSelectedGender(saved)
    }
  }, [session, status, router])

  const handleContinue = () => {
    if (!selectedGender) return

    setLoading(true)
    localStorage.setItem("wizard_gender", selectedGender)
    router.push("/wizard/upload")
  }

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

  const genderOptions = [
    { id: "man", label: "Man", icon: User },
    { id: "woman", label: "Vrouw", icon: User },
    { id: "non-binary", label: "Unisex", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <ProgressBar currentStep={2} totalSteps={4} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Type fotoshoot?</CardTitle>
            <p className="text-gray-600">Dit helpt ons de perfecte professionele portetfotos te genereren</p>
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

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/project-name")} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleContinue}
                disabled={!selectedGender || loading}
                className="bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                {loading ? "Bezig..." : "Volgende"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
