"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, User, Camera, FileText } from "lucide-react"

export default function ReviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wizardData, setWizardData] = useState<{
    projectName: string
    gender: string
    uploadedPhotos: string[]
  } | null>(null)

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
    const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")

    if (!projectName || !gender || uploadedPhotos.length === 0 || !wizardSessionId) {
      console.log("❌ Missing wizard data, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    setWizardData({
      projectName,
      gender,
      uploadedPhotos,
    })
  }, [session, status, router])

  const handleContinueToPayment = async () => {
    if (!wizardData || !session?.user?.email) return

    try {
      const wizardSessionId = sessionStorage.getItem("wizardSessionId")

      // Save wizard data to API
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: wizardSessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
          userEmail: session.user.email,
        }),
      })

      console.log("✅ Wizard data saved, going to checkout")
      router.push("/wizard/checkout")
    } catch (error) {
      console.error("❌ Failed to save wizard data:", error)
    }
  }

  if (status === "loading" || !wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Review je bestelling</h1>
          <p className="text-lg text-gray-600">Controleer je gegevens voordat je doorgaat naar de betaling</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Project Naam</label>
                  <p className="text-lg font-semibold">{wizardData.projectName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Geslacht</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    <Badge variant="secondary" className="capitalize">
                      {wizardData.gender}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Geüploade Foto's</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Camera className="w-4 h-4" />
                    <span className="font-semibold">{wizardData.uploadedPhotos.length} foto's</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wat je krijgt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>40 professionele headshots</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>HD kwaliteit (1024x1024)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Verschillende stijlen en achtergronden</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Klaar binnen 15 minuten</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photo Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Je Foto's</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {wizardData.uploadedPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={() => router.push("/wizard/upload")} className="text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar Upload
          </Button>

          <Button
            onClick={handleContinueToPayment}
            className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-3 text-lg font-semibold"
          >
            Doorgaan naar Betaling
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
