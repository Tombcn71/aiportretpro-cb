"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Shield, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
  userEmail?: string
}

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [loading, setLoading] = useState(false)
  const sessionId = searchParams.get("session")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?flow=wizard")
      return
    }

    if (!sessionId) {
      router.push("/wizard/project-name")
      return
    }

    // Load wizard data
    const loadData = async () => {
      try {
        const response = await fetch(`/api/wizard/save-data?sessionId=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setWizardData(data)
        } else {
          router.push("/wizard/project-name")
        }
      } catch (error) {
        console.error("Failed to load wizard data:", error)
        router.push("/wizard/project-name")
      }
    }

    loadData()
  }, [session, status, router, sessionId])

  const handleConfirmAndPay = async () => {
    if (!sessionId || !wizardData) return

    setLoading(true)
    try {
      // Save final wizard data
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          ...wizardData,
          userEmail: session?.user?.email,
        }),
      })

      // Create Stripe checkout
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizardSessionId: sessionId }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || !wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Overzicht & Bevestiging</h1>
          <p className="text-gray-600">Controleer je gegevens en start de AI training</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Project Naam</label>
                <p className="text-lg font-semibold">{wizardData.projectName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Geslacht</label>
                <p className="text-lg font-semibold capitalize">{wizardData.gender}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Geüploade Foto's</label>
                <p className="text-lg font-semibold">{wizardData.uploadedPhotos.length} foto's</p>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {wizardData.uploadedPhotos.slice(0, 8).map((photo, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {wizardData.uploadedPhotos.length > 8 && (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-600">+{wizardData.uploadedPhotos.length - 8}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Details */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Professional Plan
                <Badge variant="secondary" className="ml-auto">
                  Populair
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">€19,99</div>
                <p className="text-gray-600">Eenmalige betaling</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">40 professionele portretfoto's</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Verschillende zakelijke outfits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Verschillende poses en achtergronden</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">HD kwaliteit downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Klaar binnen 15 minuten</span>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-700 mb-2">Perfect voor:</p>
                <p className="text-xs text-gray-600">LinkedIn, Social Media, CV, Website en Print</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Bevestigen & Betalen</h3>
              <p className="text-gray-600">
                Je wordt doorgestuurd naar een veilige betaalpagina waar je ook coupon codes kunt invoeren
              </p>

              <Button
                onClick={handleConfirmAndPay}
                disabled={loading}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Bezig...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Bevestigen & Betalen €19,99
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Veilige betaling met iDEAL en creditcard</span>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                ✓ Geld terug garantie • ✓ Coupon codes beschikbaar op betaalpagina
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
