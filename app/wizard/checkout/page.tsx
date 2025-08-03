"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Upload, User, CreditCard, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Get wizard data from sessionStorage
    const sessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = sessionStorage.getItem("uploadedPhotos")

    console.log("📋 Loading checkout data:", {
      sessionId,
      projectName,
      gender,
      photosCount: uploadedPhotos ? JSON.parse(uploadedPhotos).length : 0,
    })

    if (!sessionId || !projectName || !gender || !uploadedPhotos) {
      console.error("❌ Missing wizard data, redirecting to start")
      router.push("/wizard/welcome")
      return
    }

    const photos = JSON.parse(uploadedPhotos)
    if (photos.length < 6) {
      console.error("❌ Not enough photos, redirecting to upload")
      router.push("/wizard/upload")
      return
    }

    setWizardData({
      sessionId,
      projectName,
      gender,
      uploadedPhotos: photos,
    })
  }, [session, router])

  const handleCheckout = async () => {
    if (!wizardData || !session?.user?.email) {
      console.error("❌ Missing wizard data or session")
      return
    }

    setLoading(true)
    console.log("🚀 Starting checkout process...")

    try {
      // First save the wizard data
      const saveResponse = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: wizardData.sessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: session.user.email,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save wizard data")
      }

      console.log("✅ Wizard data saved, creating Stripe checkout...")

      // Create Stripe checkout session
      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: wizardData.sessionId,
          couponCode: couponCode.trim() || undefined,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
        }),
      })

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { url } = await checkoutResponse.json()

      if (url) {
        console.log("✅ Redirecting to Stripe checkout:", url)
        window.location.href = url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      alert(`Er is een fout opgetreden: ${error instanceof Error ? error.message : "Onbekende fout"}`)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Gegevens laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link href="/wizard/upload" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar foto upload
        </Link>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Project naam</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Geslacht</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Foto's</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Betaling</span>
            </div>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Jouw bestelling</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{wizardData.projectName}</p>
                    <p className="text-sm text-gray-600">Project naam</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{wizardData.gender === "man" ? "M" : "V"}</span>
                  </div>
                  <div>
                    <p className="font-medium">{wizardData.gender === "man" ? "Man" : "Vrouw"}</p>
                    <p className="text-sm text-gray-600">Geslacht</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{wizardData.uploadedPhotos.length} foto's</p>
                    <p className="text-sm text-gray-600">Geüpload</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Totaal:</span>
                  <span className="text-purple-600">€19,99</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Betaling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Coupon Code */}
              <div className="space-y-2">
                <Label htmlFor="coupon">Kortingscode (optioneel)</Label>
                <Input
                  id="coupon"
                  type="text"
                  placeholder="Voer je kortingscode in"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">Heb je een kortingscode? Voer deze hier in.</p>
              </div>

              {/* What You Get */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-3">Wat krijg je:</h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>40+ professionele AI headshots</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Hoge resolutie (1024x1024)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Verschillende stijlen en achtergronden</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Klaar binnen 30 minuten</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    <span>Direct download</span>
                  </li>
                </ul>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Bezig met laden...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Veilig betalen - €19,99</span>
                  </div>
                )}
              </Button>

              <p className="text-xs text-gray-600 text-center">
                Veilige betaling via Stripe. Je gegevens zijn beschermd.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
