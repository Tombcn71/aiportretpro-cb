"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Smartphone, ArrowLeft, Loader2 } from "lucide-react"

export default function WizardCheckoutPage() {
  const [wizardData, setWizardData] = useState<any>(null)
  const [userEmail, setUserEmail] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [price, setPrice] = useState(29.99)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("wizardData")
    if (!data) {
      router.push("/wizard/welcome")
      return
    }
    const parsedData = JSON.parse(data)
    setWizardData(parsedData)

    // Check if we have all required data
    if (
      !parsedData.projectName ||
      !parsedData.gender ||
      !parsedData.uploadedPhotos ||
      parsedData.uploadedPhotos.length < 10
    ) {
      router.push("/wizard/welcome")
      return
    }
  }, [router])

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "launch50") {
      setAppliedCoupon("LAUNCH50")
      setPrice(19.99)
      setCouponCode("")
    } else if (couponCode.toLowerCase() === "save50") {
      setAppliedCoupon("SAVE50")
      setPrice(14.99)
      setCouponCode("")
    } else {
      alert("Ongeldige couponcode")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setPrice(29.99)
  }

  const handleCheckout = async () => {
    if (!userEmail || !wizardData) return

    setLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId: wizardData.sessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail,
          couponCode: appliedCoupon,
          price,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/upload")
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Voltooien en Betalen</CardTitle>
            <p className="text-gray-600">
              Je bent bijna klaar! Vul je email in en betaal om je portretten te ontvangen.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Bestelling Overzicht</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Project:</span>
                  <span className="font-medium">{wizardData.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{wizardData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span>Foto's geüpload:</span>
                  <span className="font-medium">{wizardData.uploadedPhotos?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Portretten:</span>
                  <span className="font-medium">40 stuks</span>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Adres *</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="jouw@email.com"
                required
                className="text-lg py-3"
              />
              <p className="text-xs text-gray-500">We sturen je portretten naar dit email adres</p>
            </div>

            {/* Coupon Code */}
            <div className="space-y-3">
              <Label>Kortingscode (optioneel)</Label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-800 font-medium">{appliedCoupon} toegepast</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-red-600 hover:text-red-700">
                    Verwijderen
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Voer kortingscode in"
                  />
                  <Button variant="outline" onClick={applyCoupon} disabled={!couponCode}>
                    Toepassen
                  </Button>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">40 AI Portretten</h3>
                  {appliedCoupon && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {appliedCoupon}
                      </Badge>
                      <span className="text-sm text-gray-500 line-through">€29,99</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0077B5]">€{price.toFixed(2)}</div>
                  {appliedCoupon && (
                    <div className="text-sm text-green-600">Je bespaart €{(29.99 - price).toFixed(2)}!</div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <Label>Betaalmethoden</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Creditcard</span>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border">
                  <Smartphone className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">iDEAL</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={loading}
                className="flex items-center bg-transparent"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Terug
              </Button>

              <Button
                onClick={handleCheckout}
                disabled={!userEmail || loading}
                className="bg-[#0077B5] hover:bg-[#004182] text-white py-3 px-6 text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Bezig...
                  </div>
                ) : (
                  `Betaal €${price.toFixed(2)} - Start AI Training`
                )}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-xs text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
              <p>🔒 Veilige betaling via Stripe. Je gegevens zijn beschermd.</p>
              <p>Na betaling start de AI training automatisch. Je ontvangt je portretten binnen 15 minuten.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
