"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function WizardCheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if we have wizard data
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")
    const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

    if (!projectName || !gender || !uploadedPhotos) {
      console.error("Missing wizard data, redirecting to start")
      router.push("/wizard/welcome")
    }
  }, [router])

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get wizard data from localStorage
      const projectName = localStorage.getItem("wizard_project_name")
      const gender = localStorage.getItem("wizard_gender")
      const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

      if (!projectName || !gender || !uploadedPhotos) {
        throw new Error("Missing wizard data")
      }

      const wizardData = {
        projectName,
        gender,
        uploadedPhotos: JSON.parse(uploadedPhotos),
      }

      console.log("🛒 Starting checkout with wizard data:", wizardData)

      // Save wizard data to database first
      const saveResponse = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wizardData),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save wizard data")
      }

      const { sessionId } = await saveResponse.json()
      console.log("✅ Wizard data saved with session ID:", sessionId)

      // Create checkout session with session ID in metadata
      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: "professional",
          priceId: "price_1RrFTnDswbEJWagVnjXYvNwh",
          wizardSessionId: sessionId, // Pass session ID instead of full data
        }),
      })

      if (!checkoutResponse.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await checkoutResponse.json()
      console.log("✅ Redirecting to checkout:", url)

      // Redirect to Stripe checkout
      window.location.href = url
    } catch (error) {
      console.error("❌ Checkout error:", error)
      setError(error instanceof Error ? error.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Complete Your Order</h1>
            <p className="text-gray-600">Ready to generate your professional AI headshots?</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Professional Package</h3>
            <p className="text-sm text-gray-600 mb-2">40+ high-quality AI headshots</p>
            <p className="text-2xl font-bold text-blue-600">€19.99</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment powered by Stripe. Your data is protected.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
