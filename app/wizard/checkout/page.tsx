"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, CreditCard, AlertCircle } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"
import Image from "next/image"

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

    console.log("🔍 Checking wizard data:", { projectName, gender, photosStr })

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
    if (!wizardData || !session?.user?.email) {
      console.log("❌ Missing data for payment:", { wizardData: !!wizardData, email: session?.user?.email })
      return
    }

    setLoading(true)

    try {
      console.log("💳 Starting payment process...")

      // Save wizard data to database BEFORE payment
      const saveResponse = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          photos: wizardData.photos,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save wizard data")
      }

      const { sessionId } = await saveResponse.json()
      console.log("✅ Wizard data saved with session ID:", sessionId)

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1RrFsbDswbEJWagVsEytA8rs",
          customer_email: session.user.email,
          successUrl: `${window.location.origin}/generate/processing`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
          metadata: {
            type: "wizard",
            session_id: sessionId,
            project_name: wizardData.projectName,
            gender: wizardData.gender,
            photo_count: wizardData.photos.length.toString(),
          },
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        console.log("✅ Checkout session created, redirecting to Stripe")
        window.location.href = url
      } else {
        const errorText = await response.text()
        console.error("❌ Failed to create checkout session:", errorText)
        alert("Er is een fout opgetreden bij het maken van de betaling. Probeer het opnieuw.")
        setLoading(false)
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
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

  if (!session) {
    return null
  }

  // Show loading state while wizard data is being loaded
  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Wizard data laden...</p>
        </div>
      </div>
    )
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
            <CardTitle className="text-2xl">Perfect! Je foto's zijn geüpload</CardTitle>
            <p className="text-gray-600">Nu betaal je €19,99 om je 40 professionele headshots te genereren</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Check className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">Je foto's zijn succesvol geüpload!</p>
                  <p className="text-green-700 text-sm">{wizardData.photos.length} foto's klaar voor AI training</p>
                </div>
              </div>
            </div>

            {/* Photo Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Je geüploade foto's:</h3>
              <div className="grid grid-cols-4 gap-2">
                {wizardData.photos.slice(0, 8).map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {wizardData.photos.length > 8 && (
                  <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">+{wizardData.photos.length - 8}</span>
                  </div>
                )}
              </div>
            </div>

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

            {/* Risk-Free Guarantee */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">100% Geld-terug-garantie</p>
                  <p className="text-yellow-700 text-sm">
                    Niet tevreden? Je krijgt je geld terug als je geen enkele foto download.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button - NOW ALWAYS ENABLED when wizardData exists */}
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
                    Betaal Veilig & Start Training
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                ✓ Veilige betaling met iDEAL en creditcard
                <br />✓ Geld terug garantie
                <br />✓ Training start direct na betaling
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
