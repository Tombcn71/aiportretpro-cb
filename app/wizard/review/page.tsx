"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, CreditCard, Shield, Zap } from "lucide-react"

export default function ReviewPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [wizardData, setWizardData] = useState<any>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Get all wizard data from sessionStorage
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

    if (!projectName || !gender || uploadedPhotos.length < 6) {
      console.log("❌ Incomplete wizard data, redirecting to project-name")
      router.push("/wizard/project-name")
      return
    }

    setWizardData({
      projectName,
      gender,
      uploadedPhotos,
      userEmail: session.user?.email,
    })
  }, [session, status, router])

  const handleConfirmAndPay = async () => {
    if (!wizardData || !session?.user?.email) return

    setProcessing(true)

    try {
      // Create a wizard session ID
      const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Save wizard data to the existing API
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: wizardSessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: session.user.email,
        }),
      })

      // Create Stripe checkout using existing API
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizardSessionId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
      setProcessing(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session || !wizardData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Controleer je bestelling</h1>
          <p className="text-gray-600">Bekijk je gegevens en bevestig je bestelling</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Je Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Project Naam</label>
                <p className="text-lg font-semibold">{wizardData.projectName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Geslacht</label>
                <p className="text-lg font-semibold capitalize">{wizardData.gender}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Geüploade Foto's</label>
                <p className="text-lg font-semibold">{wizardData.uploadedPhotos?.length || 0} foto's</p>
              </div>

              {wizardData.userEmail && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg font-semibold">{wizardData.userEmail}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Professional Plan
                <Badge variant="secondary">€19,99</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>40 professionele portretfoto's</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Verschillende zakelijke outfits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Verschillende poses en achtergronden</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>HD kwaliteit downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Klaar binnen 15 minuten</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-4">Perfect voor LinkedIn, Social Media, CV, Website en Print</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Veilige betaling met iDEAL en creditcard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Geld terug garantie</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <p className="text-sm text-gray-600 mb-4">
              💡 <strong>Tip:</strong> Coupon codes kunnen worden ingevoerd op de betaalpagina
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => router.back()} disabled={processing} className="px-8">
              Terug
            </Button>

            <Button onClick={handleConfirmAndPay} disabled={processing} className="px-8 bg-blue-600 hover:bg-blue-700">
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Bezig met laden...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Bevestigen & Betalen €19,99
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
