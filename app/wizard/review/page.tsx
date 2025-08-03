"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { v4 as uuidv4 } from "uuid"
import { useSession } from "next-auth/react"

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
  userEmail: string
}

export default function ReviewPage() {
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?flow=wizard")
      return
    }

    // Get data from sessionStorage
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

    if (projectName && gender && uploadedPhotos.length >= 6) {
      setWizardData({
        projectName,
        gender,
        uploadedPhotos,
        userEmail: session.user.email,
      })
    } else {
      router.push("/wizard/project-name")
    }
  }, [session, status, router])

  const handleConfirmAndPay = async () => {
    if (!wizardData || !session?.user?.email) return

    setProcessing(true)

    try {
      const wizardSessionId = sessionStorage.getItem("wizardSessionId") || uuidv4()

      // Save wizard data using the existing API
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: wizardSessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: wizardData.userEmail,
        }),
      })

      // Use existing Stripe checkout
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wizardSessionId }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("❌ Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
      setProcessing(false)
    }
  }

  if (!wizardData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={100} className="w-full h-2" style={{ backgroundColor: "#e5e7eb" }}>
              <div
                className="h-full transition-all duration-300 ease-in-out rounded-full"
                style={{
                  width: "100%",
                  backgroundColor: "#0077B5",
                }}
              />
            </Progress>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Controleer je gegevens</CardTitle>
          <p className="text-gray-600 mt-2">Stap 4 van 4: Controleer alles voordat je doorgaat naar betaling</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-2">Project naam</h3>
            <p className="text-gray-600">{wizardData.projectName}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-2">Geslacht</h3>
            <p className="text-gray-600 capitalize">{wizardData.gender}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-2">Geüploade foto's ({wizardData.uploadedPhotos.length})</h3>
            <div className="grid grid-cols-4 gap-2">
              {wizardData.uploadedPhotos.map((url, index) => (
                <img
                  key={index}
                  src={url || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Prijs</h3>
            <p className="text-2xl font-bold text-blue-900">€29,99</p>
            <p className="text-sm text-blue-700">Eenmalige betaling voor 40+ professionele headshots</p>
          </div>

          <Button
            onClick={handleConfirmAndPay}
            disabled={processing}
            className="w-full text-lg py-3"
            style={{ backgroundColor: "#0077B5" }}
          >
            {processing ? "Bezig met opslaan..." : "Doorgaan naar betaling"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
