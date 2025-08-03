"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const { data: session } = useSession()

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const sessionId = sessionStorage.getItem("wizardSessionId")
      if (!sessionId) {
        alert("Session expired. Please start over.")
        return
      }

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userEmail: session?.user?.email,
          couponCode: couponCode || undefined,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to create checkout session")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Order</CardTitle>
          <p className="text-gray-600">Get 40 professional AI headshots</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Package Details */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold text-lg mb-3">AI Headshot Package</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>40 professional headshots</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Multiple styles & backgrounds</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>High-resolution downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Ready in 15 minutes</span>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div>
            <Label htmlFor="coupon">Discount Code (Optional)</Label>
            <Input
              id="coupon"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="mt-1"
            />
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">€19.99</span>
            </div>
            {couponCode && <p className="text-sm text-green-600 mt-1">Discount code will be applied at checkout</p>}
          </div>

          {/* Checkout Button */}
          <Button onClick={handleCheckout} className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Complete Purchase"}
          </Button>

          <p className="text-xs text-gray-500 text-center">Secure payment powered by Stripe</p>
        </CardContent>
      </Card>
    </div>
  )
}
