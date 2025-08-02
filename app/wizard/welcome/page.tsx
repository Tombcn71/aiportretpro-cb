"use client"

import { useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome } from "lucide-react"
import Image from "next/image"

export default function WizardWelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Clear any existing wizard data when starting fresh
    localStorage.removeItem("wizard_project_name")
    localStorage.removeItem("wizard_gender")
    localStorage.removeItem("wizard_uploaded_photos")

    if (session) {
      console.log("✅ User already logged in, redirecting to project name")
      router.push("/wizard/project-name")
    }
  }, [session, router])

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/wizard/project-name",
    })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <Image src="/images/logo-icon.png" alt="Aragon AI" width={40} height={40} />
              <span className="text-2xl font-bold">Aragon AI</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Professionele headshots in <span className="text-orange-500">15 minuten</span>
              </h1>

              <p className="text-xl text-gray-600">
                Upload je foto's, betaal €19,99 en ontvang 40 professionele headshots. Perfect voor LinkedIn, CV en
                zakelijke doeleinden.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">40 professionele headshots</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Klaar binnen 15 minuten</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">HD kwaliteit downloads</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welkom bij Aragon AI</CardTitle>
                <p className="text-gray-600">Log in om je professionele headshots te maken</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                  disabled={status === "loading"}
                >
                  <Chrome className="mr-2 h-5 w-5" />
                  Inloggen met Google
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>Door in te loggen ga je akkoord met onze</p>
                  <div className="space-x-2">
                    <a href="/terms" className="text-blue-600 hover:underline">
                      Algemene Voorwaarden
                    </a>
                    <span>en</span>
                    <a href="/privacy" className="text-blue-600 hover:underline">
                      Privacybeleid
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
