"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Upload, User, CreditCard, Sparkles } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [wizardData, setWizardData] = useState<any>(null)

  const sessionId = searchParams.get("sessionId")

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Load wizard data
    const loadWizardData = async () => {
      try {
        const response = await fetch(`/api/wizard/save-data?sessionId=${sessionId}`)
        if (response.ok) {
          const result = await response.json()
          setWizardData(result.data)
        }
      } catch (error) {
        console.error("Failed to load wizard data:", error)
      }
    }

    loadWizardData()
  }, [session, sessionId, router])

  const handleCheckout = async () => {
    if (!sessionId || !wizardData) return

    setLoading(true)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          couponCode: couponCode.trim() || undefined,
          projectName: wizardData.project_name || wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploaded_photos || wizardData.uploadedPhotos,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const error = await response.json()
        alert(`Checkout failed: ${error.error}`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden bij het starten van de betaling.")
    } finally {
      setLoading(false)
    }
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

  const projectName = wizardData.project_name || wizardData.projectName
  const gender = wizardData.gender
  const photoCount = wizardData.uploaded_photos?.length || wizardData.uploadedPhotos?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
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
                    <p className="font-medium">{projectName}</p>
                    <p className="text-sm text-gray-600">Project naam</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{gender === "man" ? "M" : "V"}</span>
                  </div>
                  <div>
                    <p className="font-medium">{gender === "man" ? "Man" : "Vrouw"}</p>
                    <p className="text-sm text-gray-600">Geslacht</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{photoCount} foto's</p>
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
                  onChange={(e) => setCouponCode(e.target.value)}
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
