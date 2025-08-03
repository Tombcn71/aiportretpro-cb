"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface WizardData {
  projectName: string
  gender: string
  images: string[]
  step: number
}

export default function ReviewPage() {
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we have wizard data
    const data = sessionStorage.getItem("wizardData")
    if (!data) {
      router.push("/wizard/project-name")
      return
    }

    const parsedData = JSON.parse(data)
    if (!parsedData.projectName || !parsedData.gender || !parsedData.images || parsedData.images.length < 4) {
      router.push("/wizard/upload")
      return
    }

    setWizardData(parsedData)
  }, [router])

  const handleSubmit = async () => {
    if (!wizardData) return

    setIsLoading(true)

    try {
      // Save wizard data to database
      const response = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wizardData),
      })

      if (!response.ok) throw new Error("Failed to save data")

      const result = await response.json()

      // Create Stripe checkout session
      const checkoutResponse = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: result.sessionId,
          projectName: wizardData.projectName,
        }),
      })

      if (!checkoutResponse.ok) throw new Error("Failed to create checkout")

      const checkoutData = await checkoutResponse.json()

      // Redirect to Stripe
      window.location.href = checkoutData.url
    } catch (error) {
      console.error("Error:", error)
      alert("Er ging iets mis. Probeer opnieuw.")
      setIsLoading(false)
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
            <h3 className="font-semibold text-gray-900 mb-2">Geüploade foto's ({wizardData.images.length})</h3>
            <div className="grid grid-cols-4 gap-2">
              {wizardData.images.map((url, index) => (
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full text-lg py-3"
            style={{ backgroundColor: "#0077B5" }}
          >
            {isLoading ? "Bezig met opslaan..." : "Doorgaan naar betaling"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
