"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, CreditCard, Shield, Zap } from "lucide-react"

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [wizardData, setWizardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const sessionId = searchParams.get("session") || "default"

  useEffect(() => {
    // Get wizard data from sessionStorage
    const storedData = sessionStorage.getItem("wizardData")
    if (storedData) {
      setWizardData(JSON.parse(storedData))
    } else {
      // Redirect back to start if no data
      router.push("/wizard/project-name")
    }
  }, [router])

  const handleConfirmAndPay = async () => {
    if (!wizardData) return

    setIsLoading(true)
    try {
      // Save wizard data to server
      const saveResponse = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          ...wizardData,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save wizard data")
      }

      // Create Stripe checkout session
      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wizardSessionId: sessionId,
        }),
      })

      if (!checkoutResponse.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await checkoutResponse.json()

      // Redirect to Stripe checkout
      window.location.href = url
    } catch (error) {
      console.error("❌ Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Gegevens laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Controleer je bestelling</h1>
          <p className="text-gray-600">Bekijk je project details en ga door naar betaling</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Project Naam</label>
                <p className="text-lg font-semibold">{wizardData.projectName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Geslacht</label>
                <p className="text-lg font-semibold capitalize">{wizardData.gender}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Geüploade Foto's</label>
                <p className="text-lg font-semibold">{wizardData.uploadedPhotos?.length || 0} foto's</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg font-semibold">{wizardData.userEmail}</p>
              </div>
            </CardContent>
          </Card>

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Professional Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">€19,99</div>
                <Badge variant="secondary" className="mb-4">
                  Eenmalige betaling
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">40 professionele portretfoto's</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Verschillende zakelijke outfits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Verschillende poses en achtergronden</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">HD kwaliteit downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Klaar binnen 15 minuten</span>
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-6">
                Perfect voor LinkedIn, Social Media, CV, Website en Print
              </div>

              <Button
                onClick={handleConfirmAndPay}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Bezig...
                  </div>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Bevestigen & Betalen
                  </>
                )}
              </Button>

              <div className="mt-4 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>Veilige betaling met iDEAL en creditcard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>Geld terug garantie</span>
                </div>
                <div className="text-center mt-2">
                  <span>💡 Coupon codes kunnen toegepast worden op de betaalpagina</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
