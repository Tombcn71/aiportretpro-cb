"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import Link from "next/link"

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Load wizard data from localStorage
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")
    const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

    console.log("📋 Loading wizard data:", {
      projectName,
      gender,
      photosCount: uploadedPhotos ? JSON.parse(uploadedPhotos).length : 0,
    })

    if (!projectName || !gender || !uploadedPhotos) {
      console.error("❌ Missing wizard data, redirecting to start")
      router.push("/wizard/welcome")
      return
    }

    setWizardData({
      projectName,
      gender,
      uploadedPhotos: JSON.parse(uploadedPhotos),
    })
  }, [router])

  const handleCheckout = async () => {
    if (!session?.user?.email || !wizardData) {
      setError("Missing session or wizard data")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Generate unique session ID
      const sessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log("💾 Saving wizard data with session ID:", sessionId)

      // Save wizard data to server
      const saveResponse = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: session.user.email,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save wizard data")
      }

      console.log("✅ Wizard data saved, creating checkout session")

      // Create Stripe checkout session
      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1RrFsbDswbEJWagVsEytA8rs",
          successUrl: `${window.location.origin}/generate/processing`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
          customerEmail: session.user.email,
          metadata: {
            type: "wizard",
            session_id: sessionId,
            user_email: session.user.email,
            project_name: wizardData.projectName,
            gender: wizardData.gender,
          },
        }),
      })

      if (!checkoutResponse.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await checkoutResponse.json()
      if (url) {
        console.log("🚀 Redirecting to Stripe checkout")
        window.location.href = url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      setError(error instanceof Error ? error.message : "Er is een fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin?callbackUrl=/wizard/checkout")
    return null
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/wizard/upload" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar upload
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Bijna klaar! 🎉</h1>
          <p className="text-lg text-gray-600">
            Je foto's zijn geüpload. Nu alleen nog betalen en we starten direct met het maken van je professionele
            portretfoto's.
          </p>
        </div>

        <Card className="border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Professional</CardTitle>
            <div className="text-4xl font-bold text-blue-600 mt-2">€19,99</div>
            <p className="text-gray-600">40 professionele portretfoto's</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>40 professionele AI portretfoto's</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Verschillende zakelijke outfits</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Verschillende poses en achtergronden</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>HD kwaliteit downloads</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Klaar binnen 15 minuten</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Bezig met laden...
                </>
              ) : (
                "Betaal Veilig & Start Training"
              )}
            </Button>

            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>✓ Veilige betaling met iDEAL en creditcard</p>
              <p>✓ Geld terug garantie</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
