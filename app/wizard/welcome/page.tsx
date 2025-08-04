"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  const handleStart = () => {
    // Generate new wizard session ID
    const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("wizardSessionId", wizardSessionId)

    // Clear any previous wizard data
    sessionStorage.removeItem("projectName")
    sessionStorage.removeItem("gender")
    sessionStorage.removeItem("uploadedPhotos")

    console.log("🚀 Starting new wizard session:", wizardSessionId)
    router.push("/wizard/project-name")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welkom bij AI Portrait Pro</CardTitle>
            <p className="text-gray-600 mt-2">Maak professionele headshots in slechts 3 eenvoudige stappen</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">1</span>
                </div>
                <span className="text-gray-700">Geef je project een naam</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">2</span>
                </div>
                <span className="text-gray-700">Kies je geslacht</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">3</span>
                </div>
                <span className="text-gray-700">Upload je foto's</span>
              </div>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white py-3 text-lg font-semibold"
            >
              Start Nu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-center text-sm text-gray-500">Ingelogd als {session.user?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
