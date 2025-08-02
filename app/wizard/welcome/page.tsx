"use client"

import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function WizardWelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if this is a success redirect from Stripe
    const success = searchParams.get("success")
    if (success === "true") {
      setIsSuccess(true)
      // Clear localStorage after successful payment
      localStorage.removeItem("wizard_project_name")
      localStorage.removeItem("wizard_gender")
      localStorage.removeItem("wizard_uploaded_photos")
      return
    }

    // Clear localStorage when starting fresh wizard flow
    if (!success) {
      localStorage.removeItem("wizard_project_name")
      localStorage.removeItem("wizard_gender")
      localStorage.removeItem("wizard_uploaded_photos")
    }

    // If user is logged in and no success, continue to next step
    if (session && !success) {
      router.push("/wizard/project-name")
    }
  }, [session, searchParams, router])

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/wizard/project-name",
    })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  // Success state after payment
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Betaling Succesvol!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Je betaling is verwerkt en we zijn begonnen met het trainen van je AI model.
            </p>
            <p className="text-sm text-gray-500">
              Je ontvangt binnen 15 minuten een email met je professionele headshots.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-[#0077B5] hover:bg-[#005885] text-white"
            >
              Ga naar Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Login state
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welkom bij AI PortretPro</CardTitle>
            <p className="text-gray-600 mt-2">Log in om je professionele headshots te maken</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleGoogleSignIn} className="w-full bg-[#0077B5] hover:bg-[#005885] text-white">
              Inloggen met Google
            </Button>
            <p className="text-xs text-gray-500 text-center">Door in te loggen ga je akkoord met onze voorwaarden</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
