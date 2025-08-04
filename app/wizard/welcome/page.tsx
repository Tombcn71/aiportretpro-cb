"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Camera, Zap } from "lucide-react"

export default function WizardWelcome() {
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
    // Generate session ID for wizard
    const sessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("wizardSessionId", sessionId)
    router.push("/wizard/project-name")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Welkom bij AI Portrait Pro!</CardTitle>
          <p className="text-gray-600 mt-2">Maak professionele AI-headshots in slechts 3 eenvoudige stappen</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="mx-auto mb-3 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900">Project Details</h3>
              <p className="text-sm text-gray-600">Geef je project een naam en selecteer je geslacht</p>
            </div>

            <div className="text-center p-4">
              <div className="mx-auto mb-3 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Upload Foto's</h3>
              <p className="text-sm text-gray-600">Upload 4-10 foto's van jezelf voor de beste resultaten</p>
            </div>

            <div className="text-center p-4">
              <div className="mx-auto mb-3 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI Training</h3>
              <p className="text-sm text-gray-600">Onze AI maakt professionele headshots van je foto's</p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💡 Tips voor de beste resultaten:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Upload foto's met goede belichting</li>
              <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
              <li>• Gebruik verschillende hoeken en uitdrukkingen</li>
              <li>• Vermijd zonnebrillen of petten</li>
            </ul>
          </div>

          <Button
            onClick={handleStart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
            size="lg"
          >
            Start Nu - Maak Je AI Headshots
          </Button>

          <p className="text-center text-sm text-gray-500">Het hele proces duurt ongeveer 5 minuten</p>
        </CardContent>
      </Card>
    </div>
  )
}
