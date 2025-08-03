"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check } from "lucide-react"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Check if wizard data exists
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")

    if (!projectName || !gender || uploadedPhotos.length === 0 || !wizardSessionId) {
      console.log("❌ Missing wizard data, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }
  }, [session, status, router])

  const handleCheckout = async () => {
    if (!session?.user?.email) return

    setIsLoading(true)

    try {
      const wizardSessionId = sessionStorage.getItem("wizardSessionId")
      const projectName = sessionStorage.getItem("projectName")
      const gender = sessionStorage.getItem("gender")
      const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId,
          projectName,
          gender,
          uploadedPhotos,
          userEmail: session.user.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      console.log("✅ Redirecting to Stripe checkout:", url)
      window.location.href = url
    } catch (error) {
      console.error("❌ Checkout error:", error)
      setIsLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Betaling</h1>
          <p className="text-lg text-gray-600">Voltooi je bestelling om je AI headshots te ontvangen</p>
        </div>

        {/* Professional Plan Card */}
        <Card className="mb-8 border-2 border-[#0077B5] relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-[#0077B5] text-white px-4 py-1">PROFESSIONAL</Badge>
          </div>

          <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
            <div className="text-4xl font-bold text-[#0077B5] mt-2">€19,99</div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center text-lg font-semibold text-gray-700 mb-6">40 professionele portretfoto's</div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Verschillende zakelijke outfits</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Verschillende poses en achtergronden</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>HD kwaliteit downloads</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Klaar binnen 15 minuten</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-6 text-lg font-semibold rounded-lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Bezig met laden...
            </div>
          ) : (
            "Betaal Veilig & Start Direct"
          )}
        </Button>

        {/* Security Info */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500" />
            <span>Veilige betaling met iDEAL en credit card</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500" />
            <span>Geld terug garantie</span>
          </div>
        </div>
      </div>
    </div>
  )
}
