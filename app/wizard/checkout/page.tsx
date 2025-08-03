"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Auto-redirect to Stripe checkout
    const initiateCheckout = async () => {
      try {
        const sessionId = sessionStorage.getItem("wizardSessionId")
        const projectName = sessionStorage.getItem("projectName")
        const gender = sessionStorage.getItem("gender")
        const uploadedPhotos = sessionStorage.getItem("uploadedPhotos")

        if (!sessionId || !projectName || !gender || !uploadedPhotos) {
          router.push("/wizard/welcome")
          return
        }

        const photos = JSON.parse(uploadedPhotos)

        console.log("🚀 Auto-starting Stripe checkout...")

        const response = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            projectName,
            gender,
            uploadedPhotos: photos,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout")
        }

        if (data.url) {
          console.log("✅ Redirecting to Stripe:", data.url)
          window.location.href = data.url
        } else {
          throw new Error("No checkout URL received")
        }
      } catch (error) {
        console.error("❌ Checkout error:", error)
        alert(`Checkout failed: ${error instanceof Error ? error.message : "Unknown error"}`)
        router.push("/wizard/upload")
      }
    }

    initiateCheckout()
  }, [session, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to payment...</h2>
        <p className="text-gray-600">You will be redirected to Stripe checkout in a moment.</p>
      </div>
    </div>
  )
}
