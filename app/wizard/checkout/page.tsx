"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, CreditCard, Sparkles } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/welcome")
      return
    }

    // Get wizard session ID
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")
    if (!wizardSessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Load wizard data
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = sessionStorage.getItem("uploadedPhotos")

    if (!projectName || !gender || !uploadedPhotos) {
      router.push("/wizard/welcome")
      return
    }

    setWizardData({
      wizardSessionId,
      projectName,
      gender,
      photos: JSON.parse(uploadedPhotos),
    })
  }, [session, status, router])

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
          wizardSessionId: wizardData.wizardSessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          photos: wizardData.photos,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Checkout error:", data.error)
        alert("Er is een fout opgetreden bij het maken van de checkout. Probeer het opnieuw.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/upload")
  }

  if (status === "loading" || !wizardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Klaar voor checkout!</CardTitle>
            <p className="text-gray-600 mt-2">Controleer je bestelling en ga door naar betaling</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Bestelling overzicht</h3>

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
                  <span className="text-gray-600">Aantal foto's:</span>
                  <span className="font-medium">{wizardData.photos.length} geüpload</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Totaal:</span>
                    <span className="text-orange-600">€29,00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Get */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-4">Wat je krijgt:</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-green-800">40 professionele AI headshots</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-green-800">Hoge resolutie (1024x1024)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-green-800">Klaar binnen 20 minuten</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-green-800">Direct downloadbaar</span>
                </div>
              </div>
            </div>

            {/* Photo Preview */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Je geüploade foto's:</h3>
              <div className="grid grid-cols-4 gap-2">
                {wizardData.photos.slice(0, 8).map((photo: any, index: number) => (
                  <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={photo.preview || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {wizardData.photos.length > 8 && (
                  <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">+{wizardData.photos.length - 8}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1 py-3 bg-transparent" disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white py-3 text-lg font-semibold"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Betaal €29 via Stripe
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Veilige betaling via Stripe • Geen abonnement • Direct downloadbaar
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
