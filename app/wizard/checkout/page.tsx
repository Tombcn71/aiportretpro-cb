"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WizardCheckout() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    // Haal wizard data uit localStorage
    const projectName = localStorage.getItem("wizard_projectName")
    const gender = localStorage.getItem("wizard_gender")
    const uploadedPhotos = localStorage.getItem("wizard_uploadedPhotos")

    if (!projectName || !gender || !uploadedPhotos) {
      router.push("/wizard/welcome")
      return
    }

    setWizardData({
      projectName,
      gender,
      uploadedPhotos: JSON.parse(uploadedPhotos),
    })
  }, [router])

  const handleCheckout = async () => {
    if (!session?.user?.email || !wizardData) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: "professional",
          priceId: "price_1RrFTnDswbEJWagVnjXYvNwh",
          successUrl: `${window.location.origin}/generate/processing`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
          customerEmail: session.user.email,
          wizardFlow: true,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er ging iets mis bij het aanmaken van de checkout sessie")
    } finally {
      setIsLoading(false)
    }
  }

  if (!wizardData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Bevestig je bestelling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Project Details:</h3>
              <p>
                <strong>Naam:</strong> {wizardData.projectName}
              </p>
              <p>
                <strong>Gender:</strong> {wizardData.gender}
              </p>
              <p>
                <strong>Foto's:</strong> {wizardData.uploadedPhotos.length} geüpload
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Professional Headshots</h3>
              <p className="text-2xl font-bold">€19.99</p>
              <p className="text-sm text-gray-600">40+ professionele headshots</p>
            </div>

            <Button onClick={handleCheckout} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Bezig..." : "Betalen en Starten"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
