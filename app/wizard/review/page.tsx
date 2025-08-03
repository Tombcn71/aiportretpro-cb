"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Shield, CreditCard } from "lucide-react"

export default function ReviewPage() {
  const router = useRouter()
  const [wizardData, setWizardData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const sessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

    if (!sessionId || !projectName || !gender || uploadedPhotos.length === 0) {
      router.push("/wizard/welcome")
      return
    }

    setWizardData({
      sessionId,
      projectName,
      gender,
      uploadedPhotos,
    })
  }, [router])

  const handleProceedToCheckout = async () => {
    if (!wizardData) return

    setLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId: wizardData.sessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          photoCount: wizardData.uploadedPhotos.length,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      setLoading(false)
    }
  }

  if (!wizardData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Geweldige headshots wachten op je!</h1>
          <p className="text-xl text-gray-600">
            We bieden een pakket voor elk budget. Betaal eenmalig, geen abonnementen of verborgen kosten.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">100% Geld Terug Garantie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">Google Reviews 4.8</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">TrustPilot 4.8</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Review */}
          <Card>
            <CardHeader>
              <CardTitle>Je Bestelling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Project naam:</span>
                <span className="font-medium">{wizardData.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Geslacht:</span>
                <span className="font-medium capitalize">{wizardData.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Geüploade foto's:</span>
                <span className="font-medium">{wizardData.uploadedPhotos.length} foto's</span>
              </div>

              {/* Photo Preview */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Voorbeelden van je foto's:</p>
                <div className="grid grid-cols-3 gap-2">
                  {wizardData.uploadedPhotos.slice(0, 6).map((photo: string, index: number) => (
                    <img
                      key={index}
                      src={photo || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-4 py-1">Meest Populair</Badge>
            </div>

            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Professional</CardTitle>
              <div className="text-4xl font-bold text-blue-600">€19,99</div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>40 professionele portretfoto's</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Verschillende zakelijke outfits</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Verschillende poses en achtergronden</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>HD kwaliteit downloads</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Klaar binnen 15 minuten</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Betaal Veilig & Start Direct</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Veilige betaling met iDEAL en credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Geld terug garantie</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleProceedToCheckout}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {loading ? (
                  "Bezig met laden..."
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Betaal €19,99 & Start Direct
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />
                ))}
              </div>
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "Ik ben zo blij en verbaasd over hoeveel prachtige resultaten er gegenereerd werden. Deze foto's
                vertegenwoordigen mijn echte zelf"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <img src="/placeholder.svg?height=40&width=40" alt="Customer" className="w-10 h-10 rounded-full" />
                <div className="text-left">
                  <div className="font-semibold">Sarah M.</div>
                  <div className="text-sm text-gray-600">Geverifieerde klant</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
