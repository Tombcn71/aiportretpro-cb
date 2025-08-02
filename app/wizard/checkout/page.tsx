"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function WizardCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Haal wizard data uit localStorage
      const projectName = localStorage.getItem("wizard_project_name")
      const gender = localStorage.getItem("wizard_gender")
      const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

      if (!projectName || !gender || !uploadedPhotos) {
        throw new Error("Wizard data ontbreekt")
      }

      console.log("🛒 Starting checkout with wizard data")

      // Maak checkout session aan
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: "professional",
          priceId: "price_1RrFTnDswbEJWagVnjXYvNwh",
          successUrl: `${window.location.origin}/generate/processing`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
          wizardFlow: true, // Flag dat dit wizard flow is
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      setError(error instanceof Error ? error.message : "Er ging iets mis")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Bijna klaar!</h1>
          <p className="text-gray-600 mb-6">
            Je hebt alle stappen voltooid. Klik op de knop hieronder om je bestelling af te ronden.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-[#0077B5] hover:bg-[#004182]"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Bezig...
              </>
            ) : (
              "Betaal €19,99"
            )}
          </Button>

          <p className="text-xs text-gray-500 mt-4">Veilig betalen via Stripe • 40 professionele headshots</p>
        </CardContent>
      </Card>
    </div>
  )
}
