"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import Image from "next/image"

export default function ReviewPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [projectName, setProjectName] = useState("")
  const [gender, setGender] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Load all wizard data
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
          packId: "professional", // Default pack
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div className="bg-blue-500 h-2 transition-all duration-300 rounded-full" style={{ width: "100%" }}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Plan details */}
          <div>
            <Card className="border-2 border-blue-500">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional</h2>
                  <div className="text-4xl font-bold text-blue-600 mb-4">€19,99</div>
                  <p className="text-gray-600">40 professionele portretfoto's</p>
                </div>

                <div className="space-y-3">
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
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Controleer je gegevens</h1>

              <div className="bg-white rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Project naam:</h3>
                  <p className="text-gray-600">{projectName}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Geslacht:</h3>
                  <p className="text-gray-600 capitalize">{gender}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Geüploade foto's:</h3>
                  <p className="text-gray-600">{uploadedPhotos.length} foto's</p>
                </div>
              </div>
            </div>

            {/* Photo preview */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Je foto's:</h3>
              <div className="grid grid-cols-3 gap-2">
                {uploadedPhotos.slice(0, 6).map((photo, index) => (
                  <Image
                    key={index}
                    src={photo || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
                {uploadedPhotos.length > 6 && (
                  <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                    +{uploadedPhotos.length - 6} meer
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Bezig..." : "Start jouw fotoshoot nu - 19,99€ →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
