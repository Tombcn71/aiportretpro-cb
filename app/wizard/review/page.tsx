"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import Image from "next/image"

export default function ReviewPage() {
  const [projectName, setProjectName] = useState("")
  const [gender, setGender] = useState("")
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load data from sessionStorage
    const name = sessionStorage.getItem("projectName") || ""
    const genderValue = sessionStorage.getItem("gender") || ""
    const photos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

    setProjectName(name)
    setGender(genderValue)
    setUploadedPhotos(photos)

    // Redirect if missing data
    if (!name || !genderValue || photos.length === 0) {
      router.push("/wizard/project-name")
    }
  }, [router])

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          gender,
          uploadedPhotos,
          priceId: "price_1QQvJhP5wjEQJQJQvQvQvQvQ", // Replace with actual price ID
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const error = await response.json()
        console.error("Checkout error:", error)
        alert("Er is een fout opgetreden bij het starten van de betaling")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden bij het starten van de betaling")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "100%" }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Plan Details */}
          <div>
            <Card className="border-2 border-blue-500">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Professional</h2>
                  <div className="text-5xl font-bold text-blue-600 mb-2">€19,99</div>
                  <p className="text-gray-600 text-lg">40 professionele portretfoto's</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Verschillende zakelijke outfits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Verschillende poses en achtergronden</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">HD kwaliteit downloads</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Klaar binnen 15 minuten</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Review */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Controleer je bestelling</h1>
              <p className="text-gray-600 text-lg">
                Controleer of alle gegevens correct zijn voordat je doorgaat naar de betaling.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Project Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project naam:</span>
                    <span className="font-medium">{projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Geslacht:</span>
                    <span className="font-medium capitalize">{gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aantal foto's:</span>
                    <span className="font-medium">{uploadedPhotos.length} foto's</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Je foto's</h3>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedPhotos.slice(0, 6).map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {uploadedPhotos.length > 6 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">+{uploadedPhotos.length - 6}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
              {isLoading ? "Bezig..." : "Start jouw fotoshoot nu - 19,99€ →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
