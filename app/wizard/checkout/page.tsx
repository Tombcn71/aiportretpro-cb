"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleCheckout = async () => {
      try {
        // Get wizard data from sessionStorage
        const sessionId = sessionStorage.getItem("wizardSessionId")
        const projectName = sessionStorage.getItem("projectName")
        const gender = sessionStorage.getItem("gender")
        const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

        if (!sessionId || !projectName || !gender || !uploadedPhotos.length) {
          console.error("Missing wizard data")
          router.push("/wizard/welcome")
          return
        }

        console.log("🛒 Creating checkout with data:", {
          sessionId,
          projectName,
          gender,
          photoCount: uploadedPhotos.length,
          userEmail: session?.user?.email,
        })

        // Save wizard data first
        await fetch("/api/wizard/save-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            projectName,
            gender,
            uploadedPhotos,
            userEmail: session?.user?.email,
          }),
        })

        // Create Stripe checkout
        const response = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            projectName,
            gender,
            photoCount: uploadedPhotos.length,
            userEmail: session?.user?.email,
          }),
        })

        const data = await response.json()

        if (data.url) {
          // Redirect to Stripe checkout
          window.location.href = data.url
        } else {
          console.error("No checkout URL received")
          router.push("/wizard/upload")
        }
      } catch (error) {
        console.error("Checkout error:", error)
        router.push("/wizard/upload")
      }
    }

    if (session) {
      handleCheckout()
    }
  }, [session, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to secure checkout...</p>
      </div>
    </div>
  )
}
