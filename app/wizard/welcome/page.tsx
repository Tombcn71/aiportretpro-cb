"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Sparkles, Camera, Zap, Clock } from "lucide-react"

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  // Check if user just completed payment
  const isSuccess = searchParams.get("success") === "true"

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google")
    }
  }, [status])

  const handleContinue = () => {
    setLoading(true)
    router.push("/wizard/project-name")
  }

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Inloggen...</p>
        </div>
      </div>
    )
  }

  // If user just paid, show success message and training status
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold text-green-800">Betaling Succesvol! 🎉</CardTitle>
              <p className="text-green-700 mt-2">Je AI headshot training is gestart!</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Training Status */}
              <div className="bg-white rounded-lg p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0077B5] mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Training Bezig...</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Geschatte tijd: 15-20 minuten
                  </div>

                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-[#0077B5] h-2 rounded-full animate-pulse" style={{ width: "25%" }}></div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Onze AI is bezig met het leren van jouw gezicht en het genereren van 40 professionele headshots.
                  </p>
                </div>
              </div>

              {/* What's happening */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Wat gebeurt er nu:</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700">Foto's geüpload en verwerkt</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#0077B5] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-gray-700">AI model wordt getraind op jouw gezicht</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">3</span>
                    </div>
                    <span className="text-gray-500">40 professionele headshots genereren</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">4</span>
                    </div>
                    <span className="text-gray-500">Resultaten beschikbaar in dashboard</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleGoToDashboard} className="flex-1 bg-[#0077B5] hover:bg-[#004182] text-white">
                  Ga naar Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                  Status Vernieuwen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Regular welcome page for new users
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0077B5] to-[#004182] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900">
              Welkom bij AI Portret Pro! 👋
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {session?.user?.name ? `Hoi ${session.user.name.split(" ")[0]}! ` : ""}
              Laten we samen jouw perfecte professionele headshots maken.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* What to expect */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Wat kun je verwachten:</h3>

              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-[#0077B5]">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Project naam kiezen</h4>
                    <p className="text-sm text-gray-600">
                      Geef je project een naam zodat je het makkelijk kunt terugvinden
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-[#0077B5]">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Type selecteren</h4>
                    <p className="text-sm text-gray-600">Kies tussen man of vrouw voor de beste resultaten</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Camera className="h-4 w-4 text-[#0077B5]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Foto's uploaden</h4>
                    <p className="text-sm text-gray-600">Upload 6-10 foto's van jezelf voor de beste AI training</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-[#0077B5]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">AI magie</h4>
                    <p className="text-sm text-gray-600">Onze AI genereert 40 professionele headshots in 15 minuten</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">💡 Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload foto's met goede belichting</li>
                <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
                <li>• Gebruik verschillende hoeken en uitdrukkingen</li>
                <li>• Vermijd groepsfoto's</li>
              </ul>
            </div>

            <Button
              size="lg"
              onClick={handleContinue}
              disabled={loading}
              className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-4 text-lg font-semibold"
            >
              {loading ? "Bezig..." : "Laten we beginnen!"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center text-sm text-gray-500">
          <p>Hulp nodig? We zijn er voor je! Gebruik de chat rechtsonder.</p>
        </div>
      </div>
    </div>
  )
}
