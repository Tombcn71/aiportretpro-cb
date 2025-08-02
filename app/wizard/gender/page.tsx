"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function WizardGenderPage() {
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

    // Check if project name exists
    const projectName = localStorage.getItem("wizard_project_name")
    if (!projectName) {
      router.push("/wizard/project-name")
      return
    }

    // Load existing gender if available
    const existingGender = localStorage.getItem("wizard_gender")
    if (existingGender) {
      setSelectedGender(existingGender)
    }
  }, [session, status, router])

  const handleContinue = () => {
    if (!selectedGender) return

    setLoading(true)
    localStorage.setItem("wizard_gender", selectedGender)
    router.push("/wizard/upload")
  }

  const handleBack = () => {
    router.push("/wizard/project-name")
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Kies je type</CardTitle>
          <p className="text-gray-600 mt-2">Dit helpt ons de beste headshots voor je te maken</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <button
              onClick={() => setSelectedGender("man")}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedGender === "man" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">👨</div>
                <div>
                  <div className="font-semibold">Man</div>
                  <div className="text-sm text-gray-500">Mannelijke headshots</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedGender("woman")}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedGender === "woman" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">👩</div>
                <div>
                  <div className="font-semibold">Vrouw</div>
                  <div className="text-sm text-gray-500">Vrouwelijke headshots</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedGender("unisex")}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedGender === "unisex" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-3">👤</div>
                <div>
                  <div className="font-semibold">Unisex</div>
                  <div className="text-sm text-gray-500">Neutrale headshots</div>
                </div>
              </div>
            </button>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleBack} variant="outline" className="flex-1 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!selectedGender || loading}
              className="flex-1 bg-[#0077B5] hover:bg-[#005885] text-white"
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Doorgaan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-8 h-1 bg-[#0077B5] rounded"></div>
              <div className="w-8 h-1 bg-[#0077B5] rounded"></div>
              <div className="w-8 h-1 bg-gray-300 rounded"></div>
              <div className="w-8 h-1 bg-gray-300 rounded"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Stap 2 van 4</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
