"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Shield, Zap } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    // Get wizard data from localStorage
    const data = localStorage.getItem("wizardData")
    if (data) {
      setWizardData(JSON.parse(data))
    } else {
      // If no wizard data, redirect back to start
      router.push("/wizard/welcome")
    }
  }, [router])

  const handlePayment = async () => {
    if (!wizardData) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: "price_1QZJhJP5pjHFvKQqxvZ8YZAB", // €19 price
          successUrl: `${window.location.origin}/generate/processing`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
          metadata: {
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            uploadedPhotos: JSON.stringify(wizardData.uploadedPhotos),
            packId: wizardData.packId || "",
          },
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">Generate professional AI headshots in minutes</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Project Name:</span>
              <span className="text-gray-600">{wizardData.projectName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Gender:</span>
              <Badge variant="secondary" className="capitalize">
                {wizardData.gender}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Photos Uploaded:</span>
              <span className="text-gray-600">{wizardData.uploadedPhotos?.length || 0} photos</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-600">€19.00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-600">256-bit SSL encryption</p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                <h3 className="font-semibold">Fast Processing</h3>
                <p className="text-sm text-gray-600">Results in 10-15 minutes</p>
              </div>
              <div className="flex flex-col items-center">
                <CreditCard className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-semibold">Money Back</h3>
                <p className="text-sm text-gray-600">30-day guarantee</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay €19.00 & Generate Headshots
            </>
          )}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          By proceeding, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
