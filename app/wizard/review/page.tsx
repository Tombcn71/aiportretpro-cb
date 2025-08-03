"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, User, Camera, FileText, Check } from "lucide-react"

export default function ReviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wizardData, setWizardData] = useState<{
    projectName: string
    gender: string
    uploadedPhotos: string[]
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Load wizard data from sessionStorage
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")

    if (!projectName || !gender || uploadedPhotos.length === 0 || !wizardSessionId) {
      console.log("❌ Missing wizard data, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    setWizardData({
      projectName,
      gender,
      uploadedPhotos,
    })
  }, [session, status, router])

  const handleConfirmAndPay = async () => {
    if (!wizardData || !session?.user?.email) return

    setIsProcessing(true)

    try {
      const wizardSessionId = sessionStorage.getItem("wizardSessionId")

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: session.user.email,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("❌ Failed to create checkout:", error)
      setIsProcessing(false)
    }
  }

  if (status === "loading" || !wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bevestig je bestelling</h1>
          <p className="text-lg text-gray-600">Controleer je gegevens en ga door naar betaling</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Project Naam</label>
                  <p className="text-lg font-semibold">{wizardData.projectName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Geslacht</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    <Badge variant="secondary" className="capitalize">
                      {wizardData.gender}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Geüploade Foto's</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Camera className="w-4 h-4" />
                    <span className="font-semibold">{wizardData.uploadedPhotos.length} foto's</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Je Foto's</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {wizardData.uploadedPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Card */}
          <div className="space-y-6">
            <Card className="border-2 border-[#0077B5]">
              <CardHeader className="bg-[#0077B5] text-white">
                <CardTitle className="text-center">Professional</CardTitle>
                <div className="text-center">
                  <div className="text-4xl font-bold">€19,99</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>40 professionele portretfoto's</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Verschillende zakelijke outfits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Verschillende poses en achtergronden</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>HD kwaliteit downloads</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Klaar binnen 15 minuten</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Veilige betaling met iDEAL en creditcard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Geld terug garantie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Coupon codes beschikbaar op betaalpagina</span>
                  </div>
                </div>

                <Button
                  onClick={handleConfirmAndPay}
                  disabled={isProcessing}
                  className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-3 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Bezig...
                    </div>
                  ) : (
                    <>
                      Bevestigen & Betalen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={() => router.push("/wizard/upload")} className="text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar Upload
          </Button>
        </div>
      </div>
    </div>
  )
}
