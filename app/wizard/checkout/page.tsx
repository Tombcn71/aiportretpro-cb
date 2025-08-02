"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, Star } from "lucide-react"
import { PRICING_PLAN } from "@/lib/stripe"
import Image from "next/image"

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
}

export default function WizardCheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("🔍 Session status:", status)
    console.log("🔍 Session data:", session)

    // Get wizard data from localStorage
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")
    const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

    console.log("🔍 LocalStorage data:", { projectName, gender, uploadedPhotos })

    // Set wizard data regardless of session status for now
    if (projectName && gender && uploadedPhotos) {
      try {
        const parsedPhotos = JSON.parse(uploadedPhotos)
        setWizardData({
          projectName,
          gender,
          uploadedPhotos: parsedPhotos,
        })
        console.log("✅ Wizard data set:", { projectName, gender, uploadedPhotos: parsedPhotos })
      } catch (error) {
        console.error("❌ Error parsing photos:", error)
        setError("Error parsing uploaded photos")
      }
    } else {
      console.log("❌ Missing localStorage data")
      setError("Missing wizard data - please start from the beginning")
    }
  }, [session, status])

  const handleCheckout = async () => {
    if (!wizardData) {
      setError("No wizard data available")
      return
    }

    if (!session) {
      setError("Please log in first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("🛒 Starting checkout with:", {
        priceId: PRICING_PLAN.priceId,
        wizardData: wizardData,
      })

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: PRICING_PLAN.priceId,
          wizardData: wizardData,
          successUrl: `${window.location.origin}/wizard/welcome?success=true`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
        }),
      })

      console.log("📡 Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ Checkout API error:", errorData)
        throw new Error(errorData.error || "Checkout failed")
      }

      const data = await response.json()
      console.log("✅ Checkout response:", data)

      if (data.url) {
        console.log("🚀 Redirecting to:", data.url)
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      setError(error instanceof Error ? error.message : "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  // Show the page content regardless of session status for debugging
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        {/* Debug info */}
        <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
          <p>Session status: {status}</p>
          <p>Session exists: {session ? "Yes" : "No"}</p>
          <p>Wizard data: {wizardData ? "Loaded" : "Missing"}</p>
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left side - Photos grid */}
          <div className="space-y-8">
            <div>
              <Button variant="ghost" onClick={() => router.push("/wizard/upload")} className="mb-6 p-0 h-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Get your headshots in <span className="text-orange-500">minutes</span>, not days
              </h1>
            </div>

            {/* Photos grid - 2x4 layout */}
            <div className="grid grid-cols-2 gap-4">
              {[
                "/images/professional-man-1.jpg",
                "/images/professional-woman-1.jpg",
                "/images/professional-man-2.jpg",
                "/images/professional-woman-2.jpg",
                "/images/professional-man-3.jpg",
                "/images/professional-woman-3.jpg",
                "/images/professional-man-4.jpg",
                "/images/professional-woman-4.jpg",
              ].map((src, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt="Professional headshot"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Trustpilot */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
                ))}
              </div>
              <span className="text-sm font-medium">Trustpilot</span>
            </div>

            {/* Testimonial */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 italic mb-4">
                "Some of my family initially worried that I was wasting time and money, but after seeing the results,
                they were amazed. I had been dreading the task of getting a great photo for my author bio in my upcoming
                book, and now that worry is gone. Thank you!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <span className="font-medium">Adam Weygandt</span>
              </div>
            </div>

            {/* Company logos */}
            <div className="space-y-4">
              <p className="text-center text-gray-600 font-medium">Trusted by teams at</p>
              <div className="flex items-center justify-center space-x-8 opacity-60 text-xs">
                <span>Trinity College</span>
                <span>NEW YORK UNIVERSITY</span>
                <span>ASU</span>
                <span>UC Berkeley</span>
                <span>Microsoft</span>
                <span>PWC</span>
              </div>
            </div>
          </div>

          {/* Right side - Pricing */}
          <div className="flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-8 text-right">
              <div className="inline-flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-lg">Aragon.ai</span>
              </div>
            </div>

            {/* Order summary */}
            {wizardData && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Je bestelling:</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Project:</span>
                    <span>{wizardData.projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>
                      {wizardData.gender === "man" ? "Man" : wizardData.gender === "woman" ? "Vrouw" : "Unisex"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Foto's:</span>
                    <span>{wizardData.uploadedPhotos.length} geüpload</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Pricing Card */}
            <Card className="border-2 border-orange-500 mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Professional</CardTitle>
                    <div className="flex items-baseline mt-2">
                      <span className="text-4xl font-bold">€{PRICING_PLAN.price}</span>
                      <span className="text-gray-500 line-through ml-2">€39</span>
                    </div>
                  </div>
                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>{PRICING_PLAN.photos} headshots</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>15 mins generation time</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>All attires included</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>All backgrounds included</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Enhanced image resolution</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={loading || !wizardData || !session}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
                >
                  {loading ? "Creating checkout..." : !session ? "Please log in first" : "Get My Headshots"}
                </Button>
              </CardContent>
            </Card>

            {/* Security badges */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border border-gray-400 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span>Security built for Fortune 500 companies</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border border-green-500 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span>100% Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
