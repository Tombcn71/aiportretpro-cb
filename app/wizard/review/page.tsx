"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function ReviewPage() {
  const [wizardData, setWizardData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("wizardData")
    if (data) {
      setWizardData(JSON.parse(data))
    }
  }, [])

  const handleCheckout = async () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          wizardSessionId: Date.now().toString(),
          packId: "928",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = data.url
      } else {
        console.error("Checkout failed")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/upload")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-600 h-2 w-full"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-8">
            ← Terug
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Plan details */}
            <div className="bg-white rounded-lg border-2 border-blue-500 p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional</h2>
                <div className="text-4xl font-bold text-blue-600 mb-2">€19,99</div>
                <p className="text-gray-600">40 professionele portretfoto's</p>
              </div>

              <div className="space-y-4">
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
            </div>

            {/* Right side - Summary */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Overzicht van je bestelling</h1>
                <p className="text-gray-600">Controleer je gegevens voordat je doorgaat naar de betaling.</p>
              </div>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Project naam</h3>
                  <p className="text-gray-600">{wizardData.projectName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Geslacht</h3>
                  <p className="text-gray-600 capitalize">{wizardData.gender}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Geüploade foto's</h3>
                  <p className="text-gray-600">{wizardData.uploadedPhotos?.length || 0} foto's</p>
                </div>
              </div>

              {wizardData.uploadedPhotos && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Je foto's</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {wizardData.uploadedPhotos.slice(0, 8).map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                  {wizardData.uploadedPhotos.length > 8 && (
                    <p className="text-sm text-gray-500 mt-2">+{wizardData.uploadedPhotos.length - 8} meer foto's</p>
                  )}
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-lg font-medium text-lg"
              >
                {loading ? "Bezig..." : "Start jouw fotoshoot nu - 19,99€ →"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
