"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Upload, CreditCard, Sparkles } from "lucide-react"

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

  const handleStart = () => {
    router.push("/wizard/project-name")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welkom bij AI Portrait Pro</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Maak professionele AI-headshots in slechts 3 eenvoudige stappen
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Stap 1: Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Geef je project een naam en selecteer je geslacht voor de beste resultaten
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Stap 2: Upload Foto's</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Upload 4-10 foto's van jezelf voor de beste AI-training resultaten
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Stap 3: Betaling</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Eenmalige betaling van €29 voor 40 professionele AI-headshots
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white mb-8">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Wat krijg je?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>40 professionele AI-headshots</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Hoge resolutie (1024x1024)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Verschillende stijlen & poses</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Klaar binnen 20 minuten</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Nu - Stap 1 van 3
          </Button>
          <p className="text-sm text-gray-500 mt-4">Geen verborgen kosten • Veilige betaling via Stripe</p>
        </div>
      </div>
    </div>
  )
}
