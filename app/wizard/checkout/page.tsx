"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { trackViewContent, trackInitiateCheckout } from "@/lib/facebook-pixel"

export default function WizardCheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sessionData, setSessionData] = useState<any>(null)

  // Track checkout page view
  useEffect(() => {
    trackViewContent("Wizard Checkout", 19.99)
  }, [])

  // Get session data from localStorage
  useEffect(() => {
    const data = localStorage.getItem("wizardSession")
    if (data) {
      setSessionData(JSON.parse(data))
    }
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/wizard/welcome")
      return
    }
  }, [session, status, router])

  const handleCheckout = async () => {
    if (!session || !sessionData) return

    setLoading(true)

    // Track checkout initiation
    trackInitiateCheckout(19.99)

    try {
      // Save wizard data to database first
      const saveResponse = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: sessionData.projectName,
          gender: sessionData.gender,
          photos: sessionData.photos,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save wizard data")
      }

      const { sessionId } = await saveResponse.json()

      // Create Stripe checkout session
      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1RrFsbDswbEJWagVsEytA8rs",
          wizardSessionId: sessionId,
          successUrl: `${window.location.origin}/generate/processing`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
        }),
      })

      const checkoutData = await checkoutResponse.json()

      if (checkoutData.url) {
        window.location.href = checkoutData.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  const features = [
    "40 professionele AI portretfoto's",
    "Verschillende zakelijke outfits",
    "Verschillende poses en achtergronden",
    "HD kwaliteit downloads",
    "Klaar binnen 15 minuten",
    "Perfect voor LinkedIn, Social Media, CV, Website en Print",
  ]

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Link href="/wizard/upload" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar upload
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bijna klaar! 🎉</h1>
            <p className="text-lg text-gray-600">
              Je foto's zijn geüpload. Nu alleen nog betalen en we starten direct met het maken van je professionele
              portretfoto's.
            </p>
          </div>

          {/* Summary */}
          {sessionData && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Je bestelling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Project naam:</span>
                  <span className="font-medium">{sessionData.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Geslacht:</span>
                  <span className="font-medium">{sessionData.gender === "man" ? "Man" : "Vrouw"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Foto's geüpload:</span>
                  <span className="font-medium">{sessionData.photos?.length || 0} foto's</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Card */}
          <Card className="border-2 border-[#0077B5] shadow-xl">
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-bold">Professional</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#0077B5]">€19,99</span>
              </div>
              <p className="text-gray-600 mt-2">40 professionele portretfoto's</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleCheckout}
                disabled={loading || !sessionData}
                className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-4 text-lg font-semibold"
              >
                {loading ? "Bezig met laden..." : "Betaal Veilig & Start Training"}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>✓ Veilige betaling met iDEAL en creditcard</p>
                <p>✓ Geld terug garantie</p>
                <p>✓ Training start direct na betaling</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
