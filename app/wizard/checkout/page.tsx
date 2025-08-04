"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, CheckCircle, User, Upload, Sparkles } from "lucide-react"

export default function WizardCheckout() {
  const { data: session } = useSession()
  const router = useRouter()
  const [wizardData, setWizardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load existing wizard data
    const saved = localStorage.getItem("wizardData")
    if (saved) {
      const data = JSON.parse(saved)
      if (data.step >= 3 && data.images?.length >= 4) {
        setWizardData(data)
      } else {
        router.push("/wizard/welcome")
      }
    } else {
      router.push("/wizard/welcome")
    }
  }, [router])

  const handlePayment = async () => {
    if (!wizardData) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          images: wizardData.images,
          type: "wizard",
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
      alert("Er ging iets mis. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/upload")
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bijna klaar! 🎉</h1>
          <p className="text-gray-600">Controleer je bestelling en ga door naar betaling</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Bestelling Overzicht
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Project:</span>
                </div>
                <span className="font-medium">{wizardData.projectName}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Geslacht:</span>
                </div>
                <span className="font-medium capitalize">{wizardData.gender}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <Upload className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Foto's:</span>
                </div>
                <span className="font-medium">{wizardData.images?.length || 0} geüpload</span>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-orange-800">Totaal:</span>
                  <span className="text-2xl font-bold text-orange-600">€29,00</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">Eenmalige betaling • Geen abonnement</p>
              </div>
            </CardContent>
          </Card>

          {/* What You Get */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
                Wat krijg je?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>40 professionele AI-headshots</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Hoge resolutie (1024x1024 pixels)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Verschillende professionele stijlen</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Klaar binnen 20 minuten</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Direct downloadbaar</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Commercieel gebruik toegestaan</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🔒 Veilige Betaling</h4>
                <p className="text-sm text-blue-700">
                  Betaling wordt veilig verwerkt door Stripe. We slaan geen creditcardgegevens op.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={handleBack} className="flex items-center bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar Upload
          </Button>

          <Button
            onClick={handlePayment}
            disabled={isLoading}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Laden...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Betaal €29 - Start AI Training
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Door te betalen ga je akkoord met onze{" "}
          <a href="/terms" className="text-orange-600 hover:underline">
            Algemene Voorwaarden
          </a>{" "}
          en{" "}
          <a href="/privacy" className="text-orange-600 hover:underline">
            Privacybeleid
          </a>
        </p>
      </div>
    </div>
  )
}
