"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function GenderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Check if project name exists
    const projectName = localStorage.getItem("wizard_project_name")
    if (!projectName) {
      router.push("/wizard/project-name")
      return
    }

    // Load existing gender if available
    const savedGender = localStorage.getItem("wizard_gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }
  }, [session, status, router])

  const handleNext = () => {
    if (!selectedGender) return

    setLoading(true)

    // Save to localStorage
    localStorage.setItem("wizard_gender", selectedGender)

    // Navigate to upload
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={2} totalSteps={4} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Selecteer je type</CardTitle>
            <p className="text-gray-600">Dit helpt onze AI om de beste resultaten voor je te genereren</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedGender("man")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedGender === "man" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-4xl mb-2">👨‍💼</div>
                <div className="font-semibold">Man</div>
              </button>

              <button
                onClick={() => setSelectedGender("vrouw")}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedGender === "vrouw" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-4xl mb-2">👩‍💼</div>
                <div className="font-semibold">Vrouw</div>
              </button>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/project-name")} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
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
