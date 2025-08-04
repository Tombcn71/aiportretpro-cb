"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Check, Sparkles, Clock, Download, Shield } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wizardData, setWizardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/checkout")
      return
    }

    // Load wizard data
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = sessionStorage.getItem("uploadedPhotos")

    if (!wizardSessionId || !projectName || !gender || !uploadedPhotos) {
      router.push("/wizard/welcome")
      return
    }

    try {
      const photos = JSON.parse(uploadedPhotos)
      setWizardData({
        wizardSessionId,
        projectName,
        gender,
        photos,
      })
    } catch (error) {
      console.error("Error loading wizard data:", error)
      router.push("/wizard/welcome")
    }
  }, [session, status, router])

  const handlePayment = async () => {
    if (!wizardData) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/wizard-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wizardSessionId: wizardData.wizardSessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          photos: wizardData.photos,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Er is een fout opgetreden bij het starten van de betaling. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/upload")
  }

  if (status === "loading" || !wizardData) {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-orange-500" />
                Bestelling Overzicht
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Project Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Project Naam</h3>
                    <p className="text-gray-600">{wizardData.projectName}</p>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {wizardData.gender === "man" ? "Mannelijk" : "Vrouwelijk"}
                  </Badge>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Geüploade Foto's ({wizardData.photos.length})</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {wizardData.photos.slice(0, 8).map((photo: string, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Photo ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {wizardData.photos.length > 8 && (
                      <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-sm text-gray-600">+{wizardData.photos.length - 8}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* What You Get */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Dit krijg je:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">40 professionele AI headshots</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Hoge resolutie (1024x1024 pixels)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Verschillende poses en achtergronden</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Direct downloadbaar</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-orange-500" />
                Betaling
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Portrait Pro</h3>
                    <p className="text-gray-600">40 professionele headshots</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">€29</div>
                    <div className="text-sm text-gray-500">Eenmalig</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Totaal</span>
                    <span className="text-orange-600">€29,00</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Inclusief BTW</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-blue-800">Klaar binnen 20 minuten</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Download className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-800">Direct downloadbaar</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-purple-800">Veilige betaling via Stripe</span>
                </div>
              </div>

              {/* Payment Button */}
              <div className="space-y-4">
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Bezig met laden...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Betaal Nu - €29
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="w-full h-12 bg-transparent"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Terug naar Upload
                </Button>
              </div>

              {/* Trust badges */}
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">Veilig betalen met</p>
                <div className="flex justify-center space-x-4 opacity-60">
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">iDEAL</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</div>
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
