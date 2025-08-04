"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Check } from "lucide-react"
import Link from "next/link"

export default function WizardCheckout() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [wizardData, setWizardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?callbackUrl=/wizard/checkout")
      return
    }

    // Load wizard data
    const savedData = localStorage.getItem("wizard_data")
    if (savedData) {
      try {
        setWizardData(JSON.parse(savedData))
      } catch (error) {
        console.error("Error loading wizard data:", error)
        router.push("/wizard/welcome")
      }
    } else {
      router.push("/wizard/welcome")
    }
  }, [session, status, router])

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "launch50") {
      setDiscount(10)
      setCouponApplied(true)
    } else {
      alert("Ongeldige couponcode")
    }
  }

  const handleCheckout = async () => {
    if (!wizardData || !session) return

    setIsLoading(true)

    try {
      const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const finalPrice = 29 - discount

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: session.user?.email,
          couponCode: couponApplied ? couponCode : null,
          price: finalPrice,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const error = await response.json()
        alert(`Fout bij het maken van checkout: ${error.error}`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er ging iets mis bij het maken van de betaling. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || !wizardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const originalPrice = 29
  const finalPrice = originalPrice - discount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Bevestig je bestelling</CardTitle>
          <p className="text-gray-600">Je bent bijna klaar om je AI-portretten te maken!</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-900">Bestelling overzicht</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Project:</span>
                <span className="font-medium">{wizardData.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span>Geslacht:</span>
                <span className="font-medium">{wizardData.gender}</span>
              </div>
              <div className="flex justify-between">
                <span>Foto's:</span>
                <span className="font-medium">{wizardData.uploadedPhotos?.length || 0}</span>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>40 AI Portretten:</span>
                <span>€{originalPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Korting ({couponCode}):</span>
                  <span>-€{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Totaal:</span>
                <span>€{finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          {!couponApplied && (
            <div className="space-y-2">
              <Label htmlFor="coupon">Couponcode (optioneel)</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  type="text"
                  placeholder="Voer couponcode in"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline" onClick={applyCoupon} disabled={!couponCode.trim()}>
                  Toepassen
                </Button>
              </div>
            </div>
          )}

          {couponApplied && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <Check className="w-5 h-5" />
              <span>Couponcode toegepast! Je bespaart €{discount.toFixed(2)}</span>
            </div>
          )}

          {/* What You Get */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Wat je krijgt:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 40 professionele AI-portretten</li>
              <li>• Verschillende poses en achtergronden</li>
              <li>• Hoge resolutie downloads</li>
              <li>• Klaar in ongeveer 15 minuten</li>
              <li>• Commerciële gebruiksrechten</li>
            </ul>
          </div>

          {/* Checkout Button */}
          <div className="space-y-3">
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-[#FF8C00] hover:bg-[#FFA500] text-white py-3 text-lg"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {isLoading ? "Bezig..." : `Betaal €${finalPrice.toFixed(2)}`}
            </Button>

            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/wizard/upload">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar Upload
              </Link>
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">Veilig betalen via Stripe. Je gegevens zijn beschermd.</p>
        </CardContent>
      </Card>
    </div>
  )
}
