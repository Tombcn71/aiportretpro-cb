"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function WizardCheckout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const projectName = searchParams.get("projectName")
  const gender = searchParams.get("gender")
  const userEmail = searchParams.get("userEmail")
  const uploadedPhotos = searchParams.get("uploadedPhotos")

  useEffect(() => {
    if (!projectName || !gender || !userEmail || !uploadedPhotos) {
      router.push("/wizard/welcome")
    }
  }, [projectName, gender, userEmail, uploadedPhotos, router])

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Generate unique session ID
      const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      console.log("💾 Saving wizard data before checkout...")

      // Save wizard data first
      const saveResponse = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: wizardSessionId,
          projectName,
          gender,
          uploadedPhotos: JSON.parse(uploadedPhotos || "[]"),
          userEmail,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save wizard data")
      }

      console.log("✅ Wizard data saved, creating checkout...")

      // Create Stripe checkout session
      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1QQvJhP5y0lUWKkKJvJvJvJv", // Pro plan price ID
          userEmail,
          metadata: {
            wizard_session_id: wizardSessionId,
            project_name: projectName,
            gender,
          },
        }),
      })

      if (!checkoutResponse.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await checkoutResponse.json()

      console.log("🚀 Redirecting to checkout...")
      window.location.href = url
    } catch (error) {
      console.error("❌ Checkout error:", error)
      setError(error instanceof Error ? error.message : "Checkout failed")
      setIsLoading(false)
    }
  }

  if (!projectName || !gender || !userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Complete Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Project:</strong> {projectName}
              </p>
              <p>
                <strong>Gender:</strong> {gender}
              </p>
              <p>
                <strong>Photos:</strong> {JSON.parse(uploadedPhotos || "[]").length} uploaded
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">$29</span>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <Button onClick={handleCheckout} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Purchase"
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">You will be redirected to Stripe for secure payment</p>
        </CardContent>
      </Card>
    </div>
  )
}
