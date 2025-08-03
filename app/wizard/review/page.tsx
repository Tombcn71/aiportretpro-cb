"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Shield, CreditCard } from "lucide-react"
import Image from "next/image"

export default function WizardReview() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    // Get all wizard data from sessionStorage
    const projectData = sessionStorage.getItem("wizardProjectData")
    const genderData = sessionStorage.getItem("wizardGenderData")
    const uploadData = sessionStorage.getItem("wizardUploadData")

    if (!projectData || !genderData || !uploadData) {
      router.push("/wizard/welcome")
      return
    }

    const project = JSON.parse(projectData)
    const gender = JSON.parse(genderData)
    const upload = JSON.parse(uploadData)

    setWizardData({
      projectName: project.projectName,
      gender: gender.gender,
      uploadedPhotos: upload.uploadedPhotos || [],
    })
  }, [router])

  const handleCheckout = async () => {
    if (!wizardData) return

    setIsLoading(true)
    try {
      // Create wizard session
      const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Save wizard data
      const saveResponse = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wizardSessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save wizard data")
      }

      // Create Stripe checkout
      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_professional",
          wizardSessionId,
          metadata: {
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            photoCount: wizardData.uploadedPhotos.length.toString(),
          },
        }),
      })

      if (!checkoutResponse.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await checkoutResponse.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er ging iets mis. Probeer opnieuw.")
      setIsLoading(false)
    }
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Geweldige headshots wachten op je!</h1>
              <p className="text-gray-600">
                We bieden een pakket voor elk budget. Betaal eenmalig, geen abonnementen of verborgen kosten.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 mb-8 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">100% Geld Terug Garantie</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-gray-700">Google Reviews 4.8</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex text-green-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-gray-700">TrustPilot 4.8</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Order Review */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Je bestelling</h2>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
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
                      <span className="text-gray-600">Geüploade foto's:</span>
                      <span className="font-medium">{wizardData.uploadedPhotos.length} foto's</span>
                    </div>
                  </div>
                </div>

                {/* Photo Preview */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Je foto's</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {wizardData.uploadedPhotos.slice(0, 6).map((url: string, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {wizardData.uploadedPhotos.length > 6 && (
                    <p className="text-sm text-gray-500 mt-2">+{wizardData.uploadedPhotos.length - 6} meer foto's</p>
                  )}
                </div>
              </div>

              {/* Pricing Plan */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Pakket</h2>

                <Card className="border-2 border-blue-500 relative">
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Meest Populair
                  </Badge>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">€19,99</div>
                      <p className="text-gray-600">Eenmalige betaling</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span>40 professionele portretfoto's</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span>Verschillende zakelijke outfits</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span>Verschillende poses en achtergronden</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span>HD kwaliteit downloads</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span>Klaar binnen 15 minuten</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-6">
                      Perfect voor LinkedIn, Social Media, CV, Website en Print
                    </div>

                    <Button
                      onClick={handleCheckout}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                      size="lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Bezig...</span>
                        </div>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Betaal Veilig & Start Direct
                        </>
                      )}
                    </Button>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Veilige betaling met iDEAL en credit card</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Geld terug garantie</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <Image
                  src="/placeholder.svg?height=60&width=60"
                  alt="Customer"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-2">
                    "Ik ben zo blij en verbaasd over hoeveel prachtige resultaten er gegenereerd werden. Deze foto's
                    vertegenwoordigen mijn ware zelf"
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Screenshot</p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Terug naar upload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
