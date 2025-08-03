"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Camera, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to signin")
      router.push("/auth/signin?callbackUrl=/wizard/welcome")
      return
    }

    console.log("✅ User authenticated:", session.user?.email)
  }, [session, status, router])

  const handleStart = () => {
    // Clear any existing wizard data
    localStorage.removeItem("wizard_project_name")
    localStorage.removeItem("wizard_gender")
    localStorage.removeItem("wizard_uploaded_photos")

    console.log("🚀 Starting wizard flow")
    router.push("/wizard/project-name")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Welkom bij AI Portret Pro!</CardTitle>
          <p className="text-gray-600 text-lg">Maak professionele portretfoto's in slechts 4 eenvoudige stappen</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Project naam</h3>
                <p className="text-sm text-gray-600">Geef je project een herkenbare naam</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold">Geslacht kiezen</h3>
                <p className="text-sm text-gray-600">Voor de juiste stijl en achtergronden</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Foto's uploaden</h3>
                <p className="text-sm text-gray-600">Minimaal 6 foto's voor beste resultaten</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-semibold">Training starten</h3>
                <p className="text-sm text-gray-600">AI maakt je professionele foto's</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Wat krijg je?</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>40 professionele AI portretfoto's</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Verschillende zakelijke outfits en poses</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>HD kwaliteit, klaar voor LinkedIn en CV</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Resultaat binnen 15 minuten</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button onClick={handleStart} className="w-full" size="lg">
              Start je fotoshoot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="text-center">
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Terug naar dashboard
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
