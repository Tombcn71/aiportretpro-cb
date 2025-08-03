"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Star, Shield } from "lucide-react"
import Image from "next/image"

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
  userEmail: string
}

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session")
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Get wizard data from localStorage as backup
    const savedData = localStorage.getItem(`wizard_${sessionId}`)
    if (savedData) {
      setWizardData(JSON.parse(savedData))
    }
    setLoading(false)
  }, [sessionId, router])

  const handleProceedToCheckout = async () => {
    if (!wizardData || !sessionId) return

    setProcessing(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_professional",
          wizardSessionId: sessionId,
          metadata: {
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            wizardSessionId: sessionId,
            userEmail: wizardData.userEmail,
            photoCount: wizardData.uploadedPhotos.length.toString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Error creating checkout:", error)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Gegevens laden...</p>
        </div>
      </div>
    )
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Geen gegevens gevonden</p>
          <Button onClick={() => router.push("/wizard/welcome")}>Opnieuw beginnen</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.push(`/wizard/upload?session=${sessionId}`)} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bestelling Controleren</h1>
            <p className="text-gray-600">Controleer je gegevens en ga door naar betaling</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Jouw Bestelling</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project naam:</span>
                    <span className="font-medium">{wizardData.projectName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Geslacht:</span>
                    <span className="font-medium capitalize">{wizardData.gender}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Foto's geüpload:</span>
                    <span className="font-medium">{wizardData.uploadedPhotos.length} foto's</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">E-mail:</span>
                    <span className="font-medium text-sm">{wizardData.userEmail}</span>
                  </div>
                </div>

                {/* Photo Preview */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Geüploade foto's:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {wizardData.uploadedPhotos.slice(0, 6).map((photo, index) => (
                      <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {wizardData.uploadedPhotos.length > 6 && (
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-600">+{wizardData.uploadedPhotos.length - 6}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plan */}
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Geweldige headshots wachten op je!</h2>
              <p className="text-gray-600 text-lg">Betaal eenmalig, geen abonnementen of verborgen kosten.</p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">100% Geld Terug Garantie</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Image src="/images/logo-icon.png" alt="Google" width={20} height={20} />
                  <span className="ml-1 text-sm">Google Reviews</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-sm">4.8</span>
                  <div className="flex ml-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">T</span>
                  </div>
                  <span className="ml-1 text-sm">TrustPilot</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-sm">4.8</span>
                  <div className="flex ml-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-green-600 text-green-600" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Plan */}
            <Card className="max-w-md mx-auto border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">Meest Populair</Badge>
              </div>

              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">€19,99</span>
                </div>

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">40 professionele portretfoto's</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Verschillende zakelijke outfits</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Verschillende poses en achtergronden</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">HD kwaliteit downloads</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Klaar binnen 15 minuten</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToCheckout}
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Bezig...
                    </div>
                  ) : (
                    "Betaal Veilig & Start Direct"
                  )}
                </Button>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Veilige betaling met iDEAL en credit card</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Geld terug garantie</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial */}
            <div className="mt-8 max-w-md mx-auto">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=48&width=48"
                          alt="Customer"
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-green-600 text-green-600" />
                        ))}
                      </div>
                      <p className="text-gray-700 italic text-sm mb-2">
                        "Ik ben zo blij en verbaasd over hoeveel prachtige resultaten er gegenereerd werden. Deze foto's
                        vertegenwoordigen mijn echte zelf"
                      </p>
                      <p className="text-sm text-gray-600 font-medium">- Sarah M.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
