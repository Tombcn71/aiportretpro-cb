"use client"

import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedPlan = searchParams.get("plan")

  // Get plan details
  const plans = {
    professional: { name: "Professional", price: 29, photos: 40 },
  }

  const planDetails = selectedPlan ? plans[selectedPlan as keyof typeof plans] : null

  // Redirect to checkout if user is already logged in
  useEffect(() => {
    if (session && selectedPlan && status === "authenticated") {
      handleCheckout()
    }
  }, [session, selectedPlan, status])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await signIn("google")
    } catch (error) {
      setError("Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.")
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!selectedPlan) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: selectedPlan }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Er is een fout opgetreden bij het maken van de checkout.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setError("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
        </div>
      </div>
    )
  }

  // Show checkout loading if user is authenticated and we're processing
  if (session && loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B5] mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Checkout voorbereiden...</h2>
              <p className="text-gray-600">Je wordt doorgestuurd naar Stripe om je betaling te voltooien.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Inloggen om door te gaan</CardTitle>
            {planDetails && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Geselecteerd plan:</p>
                <p className="font-semibold text-[#0077B5]">
                  {planDetails.name} - €{planDetails.price}
                </p>
                <p className="text-sm text-gray-600">{planDetails.photos} portetfotos</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white flex items-center justify-center space-x-3 py-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{loading ? "Inloggen..." : "Doorgaan met Google"}</span>
            </Button>

            <div className="text-center">
              <Button variant="ghost" onClick={() => router.push("/pricing")} className="text-sm text-gray-600">
                ← Terug naar prijzen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
