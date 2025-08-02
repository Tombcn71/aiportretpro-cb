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

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Get all wizard data from localStorage with consistent keys
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")
    const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

    console.log("🔍 Checking wizard data:")
    console.log("Project name:", projectName)
    console.log("Gender:", gender)
    console.log("Uploaded photos:", uploadedPhotos)

    if (!projectName) {
      console.log("❌ No project name, redirecting to project-name")
      router.push("/wizard/project-name")
      return
    }

    if (!gender) {
      console.log("❌ No gender, redirecting to gender")
      router.push("/wizard/gender")
      return
    }

    if (!uploadedPhotos) {
      console.log("❌ No uploaded photos, redirecting to upload")
      router.push("/wizard/upload")
      return
    }

    try {
      const parsedPhotos = JSON.parse(uploadedPhotos)
      if (!Array.isArray(parsedPhotos) || parsedPhotos.length === 0) {
        console.log("❌ Invalid photos array, redirecting to upload")
        router.push("/wizard/upload")
        return
      }

      setWizardData({
        projectName,
        gender,
        uploadedPhotos: parsedPhotos,
      })

      console.log("✅ All wizard data loaded:", {
        projectName,
        gender,
        uploadedPhotos: parsedPhotos,
      })
    } catch (error) {
      console.error("❌ Error parsing uploaded photos:", error)
      router.push("/wizard/upload")
      return
    }
  }, [session, status, router])

  const handleCheckout = async () => {
    if (!wizardData) return
    setLoading(true)

    try {
      console.log("🛒 Starting wizard checkout with PRICING_PLAN.priceId:", PRICING_PLAN.priceId)
      console.log("🛒 Wizard data:", wizardData)

      // Use existing create-checkout API with wizard metadata
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: PRICING_PLAN.priceId, // Use correct price ID from lib/stripe.ts
          wizardData: {
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            uploadedPhotos: wizardData.uploadedPhotos,
          },
          successUrl: `${window.location.origin}/wizard/welcome?success=true`,
          cancelUrl: `${window.location.origin}/wizard/checkout?canceled=true`,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Clear localStorage before redirect (data is now in Stripe metadata)
        localStorage.removeItem("wizard_project_name")
        localStorage.removeItem("wizard_gender")
        localStorage.removeItem("wizard_uploaded_photos")

        window.location.href = data.url
      } else {
        console.error("❌ No checkout URL received:", data)
        alert("Er is een fout opgetreden. Probeer het opnieuw.")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
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

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Pricing */}
          <div className="space-y-8">
            <div>
              <Button variant="ghost" onClick={() => router.push("/wizard/upload")} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Amazing headshots are waiting for you!</h1>
              <p className="text-gray-600">
                We offer a package for every budget. Pay once, no subscriptions or hidden fees.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>100% Money Back Guarantee</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>Google Reviews 4.8</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-green-500 mr-1" />
                <span>TrustPilot 4.8</span>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
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

            {/* Single pricing card */}
            <Card className="border-2 border-orange-500">
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
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-sm">👤</span>
                    </div>
                    <span>{PRICING_PLAN.photos} headshots</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-sm">⏱️</span>
                    </div>
                    <span>15 mins generation time</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-sm">👔</span>
                    </div>
                    <span>All attires included</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-sm">🖼️</span>
                    </div>
                    <span>All backgrounds included</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 text-sm">📸</span>
                    </div>
                    <span>Enhanced image resolution</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
                >
                  {loading ? "Loading..." : "Get My Headshots"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Example photos */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden relative">
                  <Image
                    src="/images/professional-woman-1.jpg"
                    alt="Professional headshot"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                    🔥 AI Generated by Aragon
                  </div>
                </div>
                <div className="aspect-square rounded-lg overflow-hidden relative">
                  <Image
                    src="/images/professional-man-1.jpg"
                    alt="Professional headshot"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                    🔥 AI Generated by Aragon
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="aspect-square rounded-lg overflow-hidden relative">
                  <Image
                    src="/images/professional-man-2.jpg"
                    alt="Professional headshot"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                    🔥 AI Generated by Aragon
                  </div>
                </div>
                <div className="aspect-square rounded-lg overflow-hidden relative">
                  <Image
                    src="/images/professional-woman-2.jpg"
                    alt="Professional headshot"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                    🔥 AI Generated by Aragon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
