"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, CreditCard } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wizardData, setWizardData] = useState<{
    projectName: string
    gender: string
    photos: string[]
  } | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Check if all previous steps are completed
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")
    const photosStr = localStorage.getItem("wizard_uploaded_photos")

    if (!projectName) {
      console.log("❌ No project name, redirecting to project-name")
      router.push("/wizard/project-name")
      return
    }

    if (!gender) {
      console.log("❌ No gender, redirecting to gender")
      router.push("/wizard/gender")
      return
    }

    if (!photosStr) {
      console.log("❌ No photos, redirecting to upload")
      router.push("/wizard/upload")
      return
    }

    try {
      const photos = JSON.parse(photosStr)
      if (photos.length < 6) {
        console.log("❌ Not enough photos, redirecting to upload")
        router.push("/wizard/upload")
        return
      }

      setWizardData({
        projectName,
        gender,
        photos,
      })

      console.log("✅ All wizard data ready:", { projectName, gender, photoCount: photos.length })
    } catch (error) {
      console.error("Error parsing photos:", error)
      router.push("/wizard/upload")
    }
  }, [session, status, router])

  const handlePayment = async () => {
    if (!wizardData || !session?.user?.email) return

    setLoading(true)

    try {
      console.log("💳 Starting payment process...")

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1RrFTnDswbEJWagVnjXYvNwh", // ECHTE PRICE ID UIT BESTAANDE CODE
          customer_email: session.user.email,
          successUrl: `${window.location.origin}/generate/processing`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
          metadata: {
            type: "wizard",
            project_name: wizardData.projectName,
            gender: wizardData.gender,
            photo_count: wizardData.photos.length.toString(),
            photos: JSON.stringify(wizardData.photos),
          },
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        console.log("✅ Checkout session created, redirecting to Stripe")
        window.location.href = url
      } else {
        console.error("❌ Failed to create checkout session")
        setLoading(false)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session || !wizardData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={4} totalSteps={4} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bevestig je bestelling</CardTitle>
            <p className="text-gray-600">Je bent bijna klaar! Controleer je gegevens en betaal om te starten.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold">Bestelling overzicht</h3>

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
                  <span className="font-medium">{wizardData.photos.length} foto's</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{session.user.email}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">AI Headshot Package</span>
                <span className="text-2xl font-bold text-[#0077B5]">€19,99</span>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  40 professionele headshots
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Klaar binnen 15-20 minuten
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Hoge resolutie downloads
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Verschillende stijlen en achtergronden
                </li>
              </ul>
            </div>

            {/* Payment Button */}
            <div className="space-y-4">
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-4 text-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Bezig met betalen...
                  </div>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Betaal €19,99 en start training
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Veilig betalen via Stripe. Je wordt doorgestuurd naar een beveiligde betalingspagina.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/upload")} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar foto's
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
