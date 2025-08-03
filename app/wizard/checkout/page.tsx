"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, Loader2, Tag } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [couponCode, setCouponCode] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Load wizard data from sessionStorage
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = sessionStorage.getItem("uploadedPhotos")

    console.log("📋 Loading wizard data:", {
      projectName,
      gender,
      photosCount: uploadedPhotos ? JSON.parse(uploadedPhotos).length : 0,
    })

    if (!projectName || !gender || !uploadedPhotos) {
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
      projectName,
      gender,
      uploadedPhotos: photos,
    })
  }, [router, session, status])

  const handleCheckout = async () => {
    if (!session?.user?.email || !wizardData) {
      setError("Missing session or wizard data")
      return
    }

    setLoading(true)
    setError("")

    try {
      const sessionId = sessionStorage.getItem("wizardSessionId")
      console.log("🚀 Creating checkout session with ID:", sessionId)

      // Create Stripe checkout session
      const checkoutData: any = {
        priceId: "price_1RrFsbDswbEJWagVsEytA8rs",
        successUrl: `${window.location.origin}/generate/processing`,
        cancelUrl: `${window.location.origin}/wizard/checkout`,
        customerEmail: session.user.email,
        metadata: {
          type: "wizard",
          session_id: sessionId,
          user_email: session.user.email,
          project_name: wizardData.projectName,
          gender: wizardData.gender,
        },
      }

      // Add coupon if provided
      if (couponCode.trim()) {
        checkoutData.couponCode = couponCode.trim()
      }

      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      })

      if (!checkoutResponse.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await checkoutResponse.json()
      if (url) {
        console.log("🚀 Redirecting to Stripe checkout")
        window.location.href = url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      setError(error instanceof Error ? error.message : "Er is een fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/wizard/upload" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar upload
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Bijna klaar! 🎉</h1>
          <p className="text-lg text-gray-600">
            Je foto's zijn geüpload. Nu alleen nog betalen en we starten direct met het maken van je professionele
            portretfoto's.
          </p>
        </div>

        <Card className="border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Professional</CardTitle>
            <div className="text-4xl font-bold text-blue-600 mt-2">€19,99</div>
            <p className="text-gray-600">40 professionele portretfoto's</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>40 professionele AI portretfoto's</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Verschillende zakelijke outfits</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Verschillende poses en achtergronden</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>HD kwaliteit downloads</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Klaar binnen 15 minuten</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="couponCode" className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Kortingscode (optioneel)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="couponCode"
                    type="text"
                    placeholder="Voer kortingscode in"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                </div>
                {couponCode && <p className="text-sm text-gray-600">Kortingscode wordt toegepast bij betaling</p>}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📋 Je project samenvatting:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Project:</strong> {wizardData.projectName}
                </p>
                <p>
                  <strong>Stijl:</strong>{" "}
                  {wizardData.gender === "man" ? "Mannelijk" : wizardData.gender === "woman" ? "Vrouwelijk" : "Unisex"}
                </p>
                <p>
                  <strong>Foto's:</strong> {wizardData.uploadedPhotos.length} geüpload
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Bezig met laden...
                </>
              ) : (
                "Betaal €19,99 & Start Training"
              )}
            </Button>

            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>✓ Veilige betaling met iDEAL en creditcard</p>
              <p>✓ Geld terug garantie</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
