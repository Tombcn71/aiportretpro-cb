"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Camera, Zap } from "lucide-react"

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      // Create wizard session
      const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("wizardSessionId", wizardSessionId)
      sessionStorage.setItem("userEmail", session.user.email)

      // Redirect to project name step
      router.push("/wizard/project-name")
    }
  }, [session, status, router])

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/wizard/welcome" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
      <div className="max-w-md w-full px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welkom bij AI Portrait Pro</CardTitle>
            <p className="text-gray-600 mt-2">Maak professionele headshots in slechts 15 minuten</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">40 professionele headshots</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Klaar binnen 15 minuten</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">HD kwaliteit downloads</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            >
              Start met Google
            </Button>

            <p className="text-xs text-gray-500">Door door te gaan ga je akkoord met onze voorwaarden</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
