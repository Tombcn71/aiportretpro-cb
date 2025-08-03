"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    const sessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = sessionStorage.getItem("uploadedPhotos")

    if (!sessionId || !projectName || !gender || !uploadedPhotos) {
      router.push("/wizard/welcome")
      return
    }
  }, [session, router])

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const sessionId = sessionStorage.getItem("wizardSessionId")
      const projectName = sessionStorage.getItem("projectName")
      const gender = sessionStorage.getItem("gender")
      const uploadedPhotos = sessionStorage.getItem("uploadedPhotos")

      if (!sessionId || !projectName || !gender || !uploadedPhotos) {
        throw new Error("Missing wizard data")
      }

      const photos = JSON.parse(uploadedPhotos)

      console.log("🚀 Starting checkout with data:", {
        sessionId,
        projectName,
        gender,
        photoCount: photos.length,
        couponCode: couponCode || "none",
      })

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          couponCode: couponCode.trim() || undefined,
          projectName,
          gender,
          uploadedPhotos: photos,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout")
      }

      if (data.url) {
        console.log("✅ Redirecting to Stripe:", data.url)
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      alert(`Checkout failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  const sessionId = sessionStorage.getItem("wizardSessionId")
  const projectName = sessionStorage.getItem("projectName")
  const gender = sessionStorage.getItem("gender")
  const uploadedPhotos = sessionStorage.getItem("uploadedPhotos")
  const photoCount = uploadedPhotos ? JSON.parse(uploadedPhotos).length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Order</CardTitle>
          <p className="text-gray-600">Get 40 professional AI headshots</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Project:</span>
              <span className="font-medium">{projectName}</span>
            </div>
            <div className="flex justify-between">
              <span>Gender:</span>
              <span className="font-medium">{gender === "man" ? "Male" : "Female"}</span>
            </div>
            <div className="flex justify-between">
              <span>Photos:</span>
              <span className="font-medium">{photoCount} uploaded</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-medium">AI Headshot Package</span>
              <span className="font-bold text-lg">€19.99</span>
            </div>
          </div>

          <div>
            <Label htmlFor="coupon">Discount Code (Optional)</Label>
            <Input
              id="coupon"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="mt-1"
            />
          </div>

          <Button onClick={handleCheckout} className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Pay €19.99 with Stripe</span>
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe. Your photos will be processed immediately after payment.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
