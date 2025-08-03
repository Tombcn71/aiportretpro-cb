"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Tag } from "lucide-react"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [price, setPrice] = useState(29)
  const [originalPrice] = useState(29)

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

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save50" && !couponApplied) {
      setPrice(Math.round(originalPrice * 0.5))
      setCouponApplied(true)
    }
  }

  const removeCoupon = () => {
    setPrice(originalPrice)
    setCouponApplied(false)
    setCouponCode("")
  }

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
          couponCode: couponApplied ? couponCode : null,
          price: price,
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Bestelling Overzicht
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>40 AI Headshots</span>
              <span className="font-semibold">€{originalPrice}</span>
            </div>

            {couponApplied && (
              <div className="flex justify-between items-center text-green-600">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>Korting ({couponCode})</span>
                </div>
                <span className="font-semibold">-€{originalPrice - price}</span>
              </div>
            )}

            <hr />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Totaal</span>
              <span>€{price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Coupon Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Kortingscode
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!couponApplied ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="coupon">Kortingscode</Label>
                  <Input
                    id="coupon"
                    type="text"
                    placeholder="Voer je kortingscode in"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={applyCoupon} variant="outline" disabled={!couponCode.trim()}>
                    Toepassen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {couponCode}
                  </Badge>
                  <span className="text-green-700">Kortingscode toegepast!</span>
                </div>
                <Button onClick={removeCoupon} variant="ghost" size="sm" className="text-red-600">
                  Verwijderen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <Button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-4 text-lg font-semibold"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Bezig met laden...
            </div>
          ) : (
            `Betaal €${price} - Start AI Training`
          )}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Veilige betaling via Stripe. Je foto's worden binnen 15 minuten verwerkt.
        </p>
      </div>
    </div>
  )
}
