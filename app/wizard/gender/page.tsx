"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, User, UserCheck } from "lucide-react"

export default function GenderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [wizardSessionId, setWizardSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/welcome")
      return
    }

    // Get wizard session ID
    const sessionId = sessionStorage.getItem("wizardSessionId")
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    setWizardSessionId(sessionId)

    // Load existing gender if any
    const savedGender = sessionStorage.getItem("gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }
  }, [session, status, router])

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender)
  }

  const handleNext = async () => {
    if (!selectedGender || !wizardSessionId) return

    setLoading(true)

    try {
      // Save gender to sessionStorage
      sessionStorage.setItem("gender", selectedGender)

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId,
          gender: selectedGender,
        }),
      })

      console.log("✅ Gender saved:", selectedGender)
      router.push("/wizard/upload")
    } catch (error) {
      console.error("Error saving gender:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/project-name")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={66} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">Stap 2 van 3</p>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Kies je geslacht</CardTitle>
            <p className="text-gray-600 mt-2">Dit helpt ons de beste AI-modellen voor jou te selecteren</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleGenderSelect("man")}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  selectedGender === "man"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {selectedGender === "man" ? <UserCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
                  <span className="font-medium">Man</span>
                </div>
              </button>

              <button
                onClick={() => handleGenderSelect("vrouw")}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  selectedGender === "vrouw"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {selectedGender === "vrouw" ? <UserCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
                  <span className="font-medium">Vrouw</span>
                </div>
              </button>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1 py-3 bg-transparent" disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedGender || loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white py-3"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Volgende
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">Ingelogd als {session.user?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
