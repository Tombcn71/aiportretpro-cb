"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles, Camera, Upload, CreditCard } from "lucide-react"

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/welcome")
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Welkom bij AI Portrait Pro</CardTitle>
            <p className="text-lg text-gray-600">
              Hoi {session.user?.name?.split(" ")[0] || "daar"}! 👋 Klaar om professionele headshots te maken?
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Process Steps */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
                Zo werkt het in 3 eenvoudige stappen:
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Stap 1: Project Setup</h4>
                    <p className="text-gray-600 text-sm">Geef je project een naam en kies je geslacht</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Stap 2: Upload Foto's</h4>
                    <p className="text-gray-600 text-sm">Upload 6-20 foto's van jezelf voor de beste resultaten</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Stap 3: Betaling</h4>
                    <p className="text-gray-600 text-sm">Eenmalige betaling van €29 voor 40 professionele headshots</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What you get */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">✨ Dit krijg je:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• 40 professionele AI headshots</li>
                <li>• Hoge resolutie (1024x1024 pixels)</li>
                <li>• Verschillende poses en achtergronden</li>
                <li>• Klaar binnen 20 minuten</li>
                <li>• Direct downloadbaar</li>
              </ul>
            </div>

            <Button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Nu - €29
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>

            <p className="text-center text-sm text-gray-500">Ingelogd als {session.user?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
