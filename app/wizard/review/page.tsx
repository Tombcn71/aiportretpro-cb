"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Edit, ArrowRight } from "lucide-react"
import Image from "next/image"

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
}

export default function ReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session")
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Get data from localStorage (set by previous steps)
    const projectName = localStorage.getItem(`wizard_${sessionId}_projectName`) || ""
    const gender = localStorage.getItem(`wizard_${sessionId}_gender`) || ""
    const uploadedPhotosStr = localStorage.getItem(`wizard_${sessionId}_uploadedPhotos`) || "[]"

    try {
      const uploadedPhotos = JSON.parse(uploadedPhotosStr)
      setWizardData({ projectName, gender, uploadedPhotos })
    } catch (error) {
      console.error("Failed to parse uploaded photos:", error)
      router.push("/wizard/welcome")
    }

    setIsLoading(false)
  }, [sessionId, router])

  const handleContinue = async () => {
    if (!wizardData || !sessionId) return

    setIsSaving(true)

    try {
      // Save wizard data to server
      const response = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: wizardData.uploadedPhotos,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save data")
      }

      console.log("✅ Wizard data saved successfully")

      // Continue to checkout
      router.push(`/wizard/checkout?session=${sessionId}`)
    } catch (error) {
      console.error("❌ Failed to save wizard data:", error)
      alert("Failed to save data. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    )
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data found. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Review Your Information</CardTitle>
            <CardDescription className="text-gray-600">
              Please review your details before proceeding to payment
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Project Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Project Name</h3>
                  <p className="text-gray-600">{wizardData.projectName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/wizard/project-name?session=${sessionId}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Gender</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600 capitalize">{wizardData.gender}</p>
                    <Badge variant="secondary">{wizardData.gender === "male" ? "Male" : "Female"}</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/wizard/gender?session=${sessionId}`)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Uploaded Photos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Uploaded Photos ({wizardData.uploadedPhotos.length})</h3>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/wizard/upload?session=${sessionId}`)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {wizardData.uploadedPhotos.map((url, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-blue-900">Order Summary</h3>
              <div className="flex items-center justify-between">
                <span className="text-blue-800">Professional AI Headshots</span>
                <Badge className="bg-blue-600 text-white">40 photos</Badge>
              </div>
              <div className="border-t border-blue-200 pt-3 flex items-center justify-between">
                <span className="font-semibold text-blue-900">Total</span>
                <span className="text-xl font-bold text-blue-900">€19.99</span>
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.back()} className="flex-1" disabled={isSaving}>
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Continue to Payment
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
