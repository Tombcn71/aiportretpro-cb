"use client"

import { useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, CheckCircle } from "lucide-react"
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
                Probeer <span className="text-orange-500">eerst gratis</span>, betaal pas later
              </h1>

              <p className="text-xl text-gray-600">
                Start nu gratis je project, upload je foto's, en betaal pas €29 als je tevreden bent met het resultaat.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">Start gratis</span>
                    <p className="text-gray-600 text-sm">Log in en setup je project</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">Upload foto's</span>
                    <p className="text-gray-600 text-sm">Geen betaling vereist</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">Betaal €29</span>
                    <p className="text-gray-600 text-sm">Alleen als je wilt doorgaan</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">40 headshots in 15 min</span>
                    <p className="text-gray-600 text-sm">Direct na betaling</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">100% risicoloos - probeer eerst, betaal later</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Start Nu Gratis</CardTitle>
                <p className="text-gray-600">Geen betaling vereist om te beginnen</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                  disabled={status === "loading"}
                >
                  <Chrome className="mr-2 h-5 w-5" />
                  Start Gratis met Google
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
