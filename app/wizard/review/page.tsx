"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function ReviewPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [projectName, setProjectName] = useState("")
  const [gender, setGender] = useState("")
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    const savedProjectName = sessionStorage.getItem("projectName")
    const savedGender = sessionStorage.getItem("gender")
    const savedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

    if (!savedProjectName || !savedGender || savedPhotos.length < 6) {
      router.push("/wizard/upload")
      return
    }

    setProjectName(savedProjectName)
    setGender(savedGender)
    setUploadedPhotos(savedPhotos)
  }, [session, router])

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const wizardSessionId =
        sessionStorage.getItem("wizardSessionId") || `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Save wizard session ID
      sessionStorage.setItem("wizardSessionId", wizardSessionId)

      // Save wizard data to server
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: wizardSessionId,
          projectName,
          gender,
          uploadedPhotos,
          userEmail: session?.user?.email,
        }),
      })

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: wizardSessionId,
          projectName,
          gender,
          photoCount: uploadedPhotos.length,
          userEmail: session?.user?.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er ging iets mis. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.push("/wizard/upload")} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Geweldige headshots wachten op je!</h1>
            <p className="text-gray-600">
              We bieden een pakket voor elk budget. Betaal eenmalig, geen abonnementen of verborgen kosten.
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium">100% Geld Terug Garantie</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Google Reviews</span>
            <div className="flex items-center">
              <span className="font-bold mr-1">4.8</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">TrustPilot</span>
            <div className="flex items-center">
              <span className="font-bold mr-1">4.8</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Je Bestelling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Project:</span>
                    <span className="font-medium">{projectName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Geslacht:</span>
                    <span className="font-medium capitalize">{gender}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Foto's:</span>
                    <span className="font-medium">{uploadedPhotos.length} geüpload</span>
                  </div>
                </div>

                {/* Photo Preview */}
                <div>
                  <h4 className="font-medium mb-2">Geüploade foto's</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedPhotos.slice(0, 6).map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {uploadedPhotos.length > 6 && (
                    <p className="text-xs text-gray-500 mt-1">+{uploadedPhotos.length - 6} meer foto's</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plan */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-[#0077B5] relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#0077B5] text-white px-4 py-1">Aanbevolen</Badge>
              </div>

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">€19,99</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3" />
                      <span>40 professionele portretfoto's</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3" />
                      <span>Verschillende zakelijke outfits</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3" />
                      <span>Verschillende poses en achtergronden</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3" />
                      <span>HD kwaliteit downloads</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3" />
                      <span>Klaar binnen 15 minuten</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-600 mr-3" />
                      <span>Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0077B5] text-white rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Betaal Veilig & Start Direct</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center">
                      <Check className="w-4 h-4 mr-2" />
                      <span>Veilige betaling met iDEAL en credit card</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Check className="w-4 h-4 mr-2" />
                      <span>Geld terug garantie</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full mt-4 bg-white text-[#0077B5] hover:bg-gray-100 font-bold py-3 text-lg"
                  >
                    {loading ? "Bezig..." : "Start Nu - €19,99"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12">
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">JD</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">
                    "Ik ben zo blij en verbaasd over hoeveel prachtige resultaten er gegenereerd werden. Deze foto's
                    vertegenwoordigen mijn echte zelf"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- Geverifieerde klant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
