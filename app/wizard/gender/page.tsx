"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, User } from "lucide-react"
import Link from "next/link"

export default function WizardGender() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [selectedGender, setSelectedGender] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?callbackUrl=/wizard/gender")
      return
    }

    // Load saved gender from localStorage
    const savedGender = localStorage.getItem("wizard_gender")
    if (savedGender) {
      setSelectedGender(savedGender)
    }
  }, [session, status, router])

  const handleContinue = async () => {
    if (!selectedGender) return

    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("wizard_gender", selectedGender)

      // Navigate to next step
      router.push("/wizard/upload")
    } catch (error) {
      console.error("Error saving gender:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Selecteer je geslacht</CardTitle>
          <p className="text-gray-600">Dit helpt ons de juiste AI-modellen te gebruiken</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedGender("man")}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedGender === "man" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <User className="w-8 h-8 mx-auto mb-2 text-[#0077B5]" />
              <p className="font-semibold text-gray-900">Man</p>
            </button>

            <button
              onClick={() => setSelectedGender("vrouw")}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedGender === "vrouw" ? "border-[#0077B5] bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <User className="w-8 h-8 mx-auto mb-2 text-[#0077B5]" />
              <p className="font-semibold text-gray-900">Vrouw</p>
            </button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/wizard/project-name">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Link>
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!selectedGender || isLoading}
              className="flex-1 bg-[#FF8C00] hover:bg-[#FFA500] text-white"
            >
              {isLoading ? "Bezig..." : "Verder"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">Stap 2 van 3</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-[#0077B5] h-2 rounded-full w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
