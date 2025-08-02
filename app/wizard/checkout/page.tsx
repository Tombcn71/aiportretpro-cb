"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check, Sparkles, Camera, Clock, Star, ArrowLeft } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"
import Image from "next/image"

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    // Get wizard data from localStorage
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")
    const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

    if (!projectName || !gender || !uploadedPhotos) {
      router.push("/wizard/project-name")
      return
    }

    setWizardData({
      projectName,
      gender,
      uploadedPhotos: JSON.parse(uploadedPhotos),
    })
  }, [router])

  const handleCheckout = async () => {
    if (!wizardData) return

    setLoading(true)

    try {
      const response = await fetch("/api/stripe/wizard-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardData: wizardData,
          successUrl: `${window.location.origin}/wizard/welcome?success=true`,
          cancelUrl: `${window.location.origin}/wizard/checkout?canceled=true`,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Er is een fout opgetreden. Probeer het opnieuw.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={4} totalSteps={4} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-[#0077B5]" />
                  Jouw Project Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Project Naam:</h3>
                  <p className="text-gray-600">{wizardData.projectName}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Type:</h3>
                  <Badge variant="secondary" className="capitalize">
                    {wizardData.gender === "man" ? "Man" : "Vrouw"}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Geüploade Foto's ({wizardData.uploadedPhotos?.length || 0}):
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {wizardData.uploadedPhotos?.slice(0, 6).map((photo: string, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {wizardData.uploadedPhotos?.length > 6 && (
                    <p className="text-sm text-gray-500 mt-2">+{wizardData.uploadedPhotos.length - 6} meer foto's</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* What you'll get */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-[#0077B5]" />
                  Wat je krijgt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>40 professionele AI headshots</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Hoge resolutie (1024x1024px)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Verschillende poses en achtergronden</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Klaar in 15-20 minuten</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Direct downloadbaar</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing */}
          <div className="space-y-6">
            <Card className="border-[#0077B5] border-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#0077B5] to-[#004182] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Professional Plan</CardTitle>
                <div className="text-3xl font-bold text-[#0077B5]">
                  €29
                  <span className="text-lg font-normal text-gray-500">/eenmalig</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Klaar in 15-20 minuten!</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-4 text-lg font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Bezig...
                    </div>
                  ) : (
                    <>
                      Betaal €29 & Start Training
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>✅ Veilig betalen met Stripe</p>
                  <p>✅ 30 dagen geld-terug-garantie</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wat gebeurt er nu?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Betaling verwerken</h4>
                    <p className="text-sm text-gray-600">Veilig via Stripe (iDEAL of creditcard)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-[#0077B5] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">AI training starten</h4>
                    <p className="text-sm text-gray-600">Onze AI leert jouw gezicht kennen</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-[#0077B5] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Headshots genereren</h4>
                    <p className="text-sm text-gray-600">40 professionele foto's maken (4 prompts × 10 foto's)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-[#0077B5] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Bekijk resultaten</h4>
                    <p className="text-sm text-gray-600">Check je dashboard voor de resultaten</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="ghost" onClick={() => router.back()} className="w-full" disabled={loading}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar foto upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
