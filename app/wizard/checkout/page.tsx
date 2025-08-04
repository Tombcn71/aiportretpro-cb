"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Sparkles, Clock, Camera } from "lucide-react"
import Image from "next/image"

export default function WizardCheckout() {
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

    // Check if we have a wizard session
    const sessionId = localStorage.getItem("wizardSessionId")
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Load wizard data
    const savedData = localStorage.getItem(`wizard_${sessionId}`)
    if (savedData) {
      const data = JSON.parse(savedData)
      setWizardData(data)

      // Validate we have all required data
      if (!data.projectName || !data.gender || !data.uploadedPhotos || data.uploadedPhotos.length < 4) {
        router.push("/wizard/welcome")
        return
      }
    } else {
      router.push("/wizard/welcome")
    }
  }, [session, status, router])

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const sessionId = localStorage.getItem("wizardSessionId")
      if (!sessionId || !wizardData) {
        router.push("/wizard/welcome")
        return
      }

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: session?.user?.email,
          successUrl: `${window.location.origin}/generate/processing?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Er ging iets mis bij het starten van de betaling. Probeer opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/upload")
  }

  if (status === "loading" || !wizardData) {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex space-x-2">
                <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
                <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
                <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <div className="w-8"></div>
            </div>

            <CardTitle className="text-2xl font-bold text-center text-gray-900">Overzicht & Betaling</CardTitle>
            <p className="text-center text-gray-600">Controleer je gegevens en start de AI-training</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Project Details */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Project Naam:</span>
                    <p className="font-semibold">{wizardData.projectName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Geslacht:</span>
                    <Badge variant="secondary" className="ml-2">
                      {wizardData.gender === "man" ? "Man" : "Vrouw"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Aantal Foto's:</span>
                    <p className="font-semibold">{wizardData.uploadedPhotos?.length || 0} foto's</p>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-orange-500" />
                    AI Headshot Pakket
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>50+ AI Headshots</span>
                      <span className="font-semibold">€29</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Verschillende stijlen</span>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>HD Kwaliteit</span>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Commercieel gebruik</span>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Totaal:</span>
                      <span className="text-orange-600">€29</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Photo Preview */}
            {wizardData.uploadedPhotos && wizardData.uploadedPhotos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Je Geüploade Foto's</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {wizardData.uploadedPhotos.slice(0, 6).map((url: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {wizardData.uploadedPhotos.length > 6 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-sm text-gray-600">+{wizardData.uploadedPhotos.length - 6}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Process Timeline */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Wat gebeurt er na de betaling?
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span>AI-training start automatisch (15-20 minuten)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span>Je ontvangt een e-mail wanneer de foto's klaar zijn</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span>Download je 50+ professionele headshots</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Betaling voorbereiden...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Betaal €29 & Start AI-Training</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
            </Button>

            <p className="text-center text-xs text-gray-500">
              Veilige betaling via Stripe • 30 dagen geld-terug-garantie
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
