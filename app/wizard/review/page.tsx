"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock } from "lucide-react"
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

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "100%" }}></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Left side - Plan details */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div className="max-w-md">
            {/* Professional Plan Card */}
            <div className="p-6 border-2 border-blue-500 rounded-lg bg-blue-50 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional</h2>
                <div className="text-4xl font-bold text-blue-600">€19,99</div>
                <div className="text-lg text-gray-600 mt-2">40 professionele portretfoto's</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Verschillende zakelijke outfits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Verschillende poses en achtergronden</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">HD kwaliteit downloads</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">Klaar binnen 15 minuten</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
                </div>
              </div>
            </div>

            {/* Project Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Project Samenvatting</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project naam:</span>
                  <span className="font-medium">{projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Geslacht:</span>
                  <span className="font-medium">{gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aantal foto's:</span>
                  <span className="font-medium">{uploadedPhotos.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Generated examples */}
        <div className="w-1/2 p-8 flex items-center justify-center bg-gray-50">
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <Image
              src="/images/professional-man-1.jpg"
              alt="Professional headshot example 1"
              width={200}
              height={250}
              className="rounded-lg shadow-lg"
            />
            <Image
              src="/images/professional-woman-1.jpg"
              alt="Professional headshot example 2"
              width={200}
              height={250}
              className="rounded-lg shadow-lg"
            />
            <Image
              src="/images/professional-man-2.jpg"
              alt="Professional headshot example 3"
              width={200}
              height={250}
              className="rounded-lg shadow-lg"
            />
            <Image
              src="/images/professional-woman-2.jpg"
              alt="Professional headshot example 4"
              width={200}
              height={250}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t bg-white">
        <Button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Bezig..." : "Start jouw fotoshoot nu - 19,99€ →"}
        </Button>
      </div>
    </div>
  )
}
