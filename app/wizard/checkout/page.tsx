"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, Tag } from "lucide-react"
import Image from "next/image"

interface CouponData {
  valid: boolean
  code: string
  discount: {
    type: "percentage" | "amount"
    value: number
  }
  error?: string
}

export default function WizardCheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const basePrice = 19.99
  const discountAmount = appliedCoupon?.valid
    ? appliedCoupon.discount.type === "percentage"
      ? (basePrice * appliedCoupon.discount.value) / 100
      : appliedCoupon.discount.value
    : 0
  const finalPrice = Math.max(0, basePrice - discountAmount)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/wizard/login")
    }
  }, [status, router])

  const validateCoupon = async () => {
    if (!couponCode.trim()) return

    setIsValidatingCoupon(true)

    try {
      const response = await fetch("/api/stripe/validate-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
        }),
      })

      const data = await response.json()

      if (data.valid) {
        setAppliedCoupon(data)
      } else {
        setAppliedCoupon({ ...data, valid: false })
      }
    } catch (error) {
      setAppliedCoupon({
        valid: false,
        code: couponCode,
        discount: { type: "percentage", value: 0 },
        error: "Er is een fout opgetreden bij het valideren van de coupon.",
      })
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
  }

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/wizard-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.email,
          couponCode: appliedCoupon?.valid ? appliedCoupon.code : null,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Error creating checkout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/upload")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
          Fantastische portretfoto's wachten op je!
        </h1>

        <p className="text-lg text-gray-600 mb-12 text-center">Bespaar tot 75% op traditionele fotoshoots</p>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left Side - Pricing Card */}
          <div className="w-full lg:w-1/2">
            <div className="border-2 border-[#0077B5] rounded-lg p-8 bg-white shadow-lg">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional</h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  {appliedCoupon?.valid && (
                    <span className="text-lg text-gray-500 line-through">€{basePrice.toFixed(2)}</span>
                  )}
                  <span className="text-4xl font-bold text-[#0077B5]">€{finalPrice.toFixed(2)}</span>
                </div>
                <p className="text-gray-600">40 professionele portretfoto's</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {[
                  "Verschillende zakelijke outfits",
                  "Verschillende poses en achtergronden",
                  "HD kwaliteit downloads",
                  "Klaar binnen 15 minuten",
                  "Perfect voor LinkedIn, Social Media, CV, Website en Print",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t pt-6 mb-6">
                <Label htmlFor="coupon" className="text-sm font-medium text-gray-700 mb-2 block">
                  Kortingscode (optioneel)
                </Label>

                {appliedCoupon?.valid ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                      <span className="text-green-600 text-sm">
                        -
                        {appliedCoupon.discount.type === "percentage"
                          ? `${appliedCoupon.discount.value}%`
                          : `€${appliedCoupon.discount.value}`}
                      </span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 text-sm underline">
                      Verwijderen
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="LAUNCH"
                      className="flex-1"
                    />
                    <Button
                      onClick={validateCoupon}
                      disabled={!couponCode.trim() || isValidatingCoupon}
                      variant="outline"
                      className="px-4 bg-transparent"
                    >
                      {isValidatingCoupon ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      ) : (
                        "Toepassen"
                      )}
                    </Button>
                  </div>
                )}

                {appliedCoupon && !appliedCoupon.valid && (
                  <p className="text-red-600 text-sm mt-2">{appliedCoupon.error || "Ongeldige kortingscode"}</p>
                )}
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white py-4 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Bezig...
                  </div>
                ) : (
                  "verder"
                )}
              </Button>
            </div>
          </div>

          {/* Right Side - Photo Grid */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-lg">
                <Image
                  src="/images/professional-man-1.jpg"
                  alt="Professional headshot man"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover brightness-110 contrast-105"
                />
              </div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-lg">
                <Image
                  src="/images/professional-woman-2.jpg"
                  alt="Professional headshot woman"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover brightness-110 contrast-105"
                />
              </div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-lg">
                <Image
                  src="/images/professional-man-2.jpg"
                  alt="Professional headshot man"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover brightness-110 contrast-105"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button onClick={handleBack} variant="outline" className="flex items-center gap-2 px-6 py-3 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Terug naar Upload
          </Button>
        </div>
      </div>
    </div>
  )
}
