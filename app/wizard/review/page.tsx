"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { v4 as uuidv4 } from "uuid"

export default function ReviewPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [wizardData, setWizardData] = useState<any>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("wizardData")
    if (stored) {
      setWizardData(JSON.parse(stored))
    } else {
      router.push("/wizard/project-name")
    }
  }, [router])

  const handleConfirmAndPay = async () => {
    if (!wizardData || !session?.user?.email) return

    setProcessing(true)
    try {
      const sessionId = uuidv4()

      // Save wizard data
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: session.user.email,
        }),
      })

      // Create checkout
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizardSessionId: sessionId }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Error:", error)
      alert("Er is een fout opgetreden")
      setProcessing(false)
    }
  }

  if (!wizardData) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Review & Betaling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Project: {wizardData.projectName}</h3>
              <p>Geslacht: {wizardData.gender}</p>
              <p>Foto's: {wizardData.uploadedPhotos?.length}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Professional Plan - €19,99</h3>
              <ul className="text-sm space-y-1">
                <li>✓ 40 professionele portretfoto's</li>
                <li>✓ Verschillende zakelijke outfits</li>
                <li>✓ HD kwaliteit downloads</li>
                <li>✓ Klaar binnen 15 minuten</li>
              </ul>
            </div>

            <Button
              onClick={handleConfirmAndPay}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {processing ? "Bezig..." : "Bevestigen & Betalen €19,99"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
