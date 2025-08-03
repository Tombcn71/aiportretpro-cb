"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function ReviewPage() {
  const [projectName, setProjectName] = useState("")
  const [gender, setGender] = useState("")
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Load all wizard data from sessionStorage
    const savedProjectName = sessionStorage.getItem("wizard_projectName")
    const savedGender = sessionStorage.getItem("wizard_gender")
    const savedPhotos = sessionStorage.getItem("wizard_uploadedPhotos")

    if (!savedProjectName) {
      router.push("/wizard/project-name")
      return
    }

    if (!savedGender) {
      router.push("/wizard/gender")
      return
    }

    if (!savedPhotos) {
      router.push("/wizard/upload")
      return
    }

    setProjectName(savedProjectName)
    setGender(savedGender)

    try {
      const photos = JSON.parse(savedPhotos)
      if (photos.length < 4) {
        router.push("/wizard/upload")
        return
      }
      setUploadedPhotos(photos)
    } catch (error) {
      console.error("Error parsing photos:", error)
      router.push("/wizard/upload")
    }
  }, [session, router])

  const handleCheckout = async () => {
    if (!session?.user?.email) return

    setIsLoading(true)

    try {
      const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          gender,
          uploadedPhotos,
          wizardSessionId,
          packId: "928",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const data = await response.json()

      if (data.url) {
        // Clear sessionStorage before redirecting
        sessionStorage.removeItem("wizard_projectName")
        sessionStorage.removeItem("wizard_gender")
        sessionStorage.removeItem("wizard_uploadedPhotos")

        // Redirect to Stripe checkout
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const genderLabels = {
    man: "Man",
    vrouw: "Vrouw",
    unisex: "Unisex",
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Controleer je bestelling</CardTitle>
          <Progress value={100} className="w-full mt-4" style={{ backgroundColor: "#e5e7eb" }}>
            <div
              className="h-full transition-all duration-300 ease-in-out rounded-full"
              style={{
                width: "100%",
                backgroundColor: "#0077B5",
              }}
            />
          </Progress>
          <p className="text-sm text-gray-600 mt-2">Stap 4 van 4</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Details */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-3">Project Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Project naam:</span>
                <span className="font-medium">{projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Geslacht:</span>
                <Badge variant="secondary">{genderLabels[gender as keyof typeof genderLabels]}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aantal foto's:</span>
                <span className="font-medium">{uploadedPhotos.length}</span>
              </div>
            </div>
          </div>

          {/* Photo Preview */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-3">Geüploade foto's</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {uploadedPhotos.slice(0, 8).map((photo, index) => (
                <Image
                  key={index}
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-20 object-cover rounded"
                />
              ))}
              {uploadedPhotos.length > 8 && (
                <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-sm text-gray-500">+{uploadedPhotos.length - 8}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-900 mb-3">Bestelling</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">AI Professional Headshots</span>
                <span className="font-medium">€19,99</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>40 hoogwaardige AI headshots</span>
                <span>Inclusief BTW</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Totaal</span>
                <span>€19,99</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/wizard/upload")} className="flex-1">
              Terug
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="flex-1"
              style={{ backgroundColor: "#0077B5" }}
            >
              {isLoading ? "Bezig..." : "Betalen & Starten"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
