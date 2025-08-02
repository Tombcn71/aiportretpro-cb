"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft, CreditCard, Shield } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([])

  useEffect(() => {
    // Get wizard data from localStorage
    const data = localStorage.getItem("wizardData")
    if (data) {
      const parsed = JSON.parse(data)
      setWizardData(parsed)

      // Get uploaded photos for preview
      if (parsed.uploadedPhotos) {
        setPreviewPhotos(parsed.uploadedPhotos.slice(0, 4)) // Show first 4 photos
      }
    } else {
      // No wizard data, redirect to start
      router.push("/start")
    }
  }, [router])

  const handleCheckout = async () => {
    if (!session || !wizardData) return

    setLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: "professional",
          wizardData: wizardData,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Er is een fout opgetreden. Probeer het opnieuw.")
      }
    } catch (error) {
      console.error("Error:", error)
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bijna klaar! 🎉</h1>
          <p className="text-gray-600">
            Je foto's zijn geüpload. Betaal nu om je 40 professionele headshots te genereren.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Order summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Je bestelling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Project naam:</span>
                  <span className="text-gray-600">{wizardData.projectName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Type:</span>
                  <span className="text-gray-600 capitalize">{wizardData.gender}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Foto's geüpload:</span>
                  <span className="text-gray-600">{wizardData.uploadedPhotos?.length || 0}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Totaal:</span>
                  <span className="text-[#0077B5]">€19,99</span>
                </div>
              </CardContent>
            </Card>

            {/* Preview photos */}
            {previewPhotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Je geüploade foto's</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {previewPhotos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Uploaded photo ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {wizardData.uploadedPhotos?.length > 4 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      +{wizardData.uploadedPhotos.length - 4} meer foto's
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right side - Payment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wat je krijgt</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>40 professionele headshots</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Verschillende zakelijke outfits</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Verschillende poses en achtergronden</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>HD kwaliteit downloads</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Klaar binnen 15 minuten</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-[#0077B5] mb-2">€19,99</div>
                  <div className="text-gray-600">Eenmalige betaling</div>
                </div>

                <Button
                  size="lg"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-4 text-lg font-semibold mb-4"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  {loading ? "Bezig..." : "Betaal veilig met Stripe"}
                </Button>

                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Shield className="h-4 w-4 mr-2" />
                  Veilige betaling met iDEAL en creditcard
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">✓ Geld terug garantie</div>
                  <div className="text-sm text-gray-600">✓ Geen abonnement</div>
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
