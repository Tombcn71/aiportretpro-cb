"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const flow = searchParams.get("flow")
  const isWizardFlow = flow === "wizard"

  useEffect(() => {
    if (status === "loading") return

    if (session) {
      if (isWizardFlow) {
        console.log("✅ User logged in, redirecting to wizard")
        router.push("/wizard/project-name")
      } else {
        router.push("/dashboard")
      }
    }
  }, [session, status, router, isWizardFlow])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", {
        callbackUrl: isWizardFlow ? "/wizard/project-name" : "/dashboard",
      })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image src="/images/logo.png" alt="AI Portrait Pro" width={120} height={40} className="mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900">
            {isWizardFlow ? "Start je AI Headshots" : "Welkom terug"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isWizardFlow ? "Log in om je professionele headshots te maken" : "Log in om je account te bekijken"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{isWizardFlow ? "Begin met je headshots" : "Inloggen"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Bezig met inloggen...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Doorgaan met Google
                </div>
              )}
            </Button>

            {isWizardFlow && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Wat gebeurt er hierna?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Geef je project een naam</li>
                  <li>• Selecteer je geslacht</li>
                  <li>• Upload 6+ foto's van jezelf</li>
                  <li>• Betaal €19,99 voor 40 headshots</li>
                  <li>• Ontvang je foto's binnen 15 minuten</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500">
          Door in te loggen ga je akkoord met onze{" "}
          <a href="/terms" className="text-[#0077B5] hover:underline">
            Algemene Voorwaarden
          </a>{" "}
          en{" "}
          <a href="/privacy" className="text-[#0077B5] hover:underline">
            Privacybeleid
          </a>
        </p>
      </div>
    </div>
  )
}
