"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const [couponCode, setCouponCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const sessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")

    if (!sessionId || !projectName || !gender) {
      router.push("/wizard/project-name")
    }
  }, [router])

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const sessionId = sessionStorage.getItem("wizardSessionId")

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          couponCode: couponCode.trim() || undefined,
        }),
      })

      const { sessionId: stripeSessionId } = await response.json()

      const stripe = await stripePromise
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: stripeSessionId })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Order</CardTitle>
          <p className="text-gray-600">Get 40 professional AI headshots</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">AI Headshot Package</span>
              <span className="font-bold">€19.99</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">40 professional headshots delivered in 15 minutes</p>
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

          <Button onClick={handleCheckout} className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Pay €19.99"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe. Your photos will be processed immediately after payment.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
