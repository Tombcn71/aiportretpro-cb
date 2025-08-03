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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Plan details */}
      <div className="w-1/2 bg-white p-8 flex flex-col justify-center">
        <div className="max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Amazing headshots are waiting for you!</h1>
            <p className="text-gray-600">
              We offer a package for every budget. Pay once, no subscriptions or hidden fees.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">100% Money Back Guarantee</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Google Reviews</span>
              <div className="flex items-center space-x-1">
                <span className="font-bold">4.8</span>
                <div className="flex text-yellow-400">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">TrustPilot</span>
              <div className="flex items-center space-x-1">
                <span className="font-bold">4.8</span>
                <div className="flex text-green-500">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Plan details */}
          <div className="mt-8 p-6 border-2 border-orange-500 rounded-lg bg-orange-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Professional</h3>
              <div className="text-right">
                <div className="text-3xl font-bold">€19</div>
                <div className="text-sm text-gray-500 line-through">€39</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">40 headshots</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">15 mins eta</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Choice of 2 attires</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">2 backgrounds</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Standard resolution</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Generated examples */}
      <div className="w-1/2 p-8 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-03%20at%2015.20.35-rw0hazL0ylykSkY2JFeWOyLAmFww8x.png"
            alt="Professional headshot example 1"
            width={200}
            height={250}
            className="rounded-lg shadow-lg"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-03%20at%2015.20.35-rw0hazL0ylykSkY2JFeWOyLAmFww8x.png"
            alt="Professional headshot example 2"
            width={200}
            height={250}
            className="rounded-lg shadow-lg"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-03%20at%2015.20.35-rw0hazL0ylykSkY2JFeWOyLAmFww8x.png"
            alt="Professional headshot example 3"
            width={200}
            height={250}
            className="rounded-lg shadow-lg"
          />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-03%20at%2015.20.35-rw0hazL0ylykSkY2JFeWOyLAmFww8x.png"
            alt="Professional headshot example 4"
            width={200}
            height={250}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            {isLoading ? "Bezig..." : "Verder met Pro"}
          </Button>
        </div>
      </div>
    </div>
  )
}
