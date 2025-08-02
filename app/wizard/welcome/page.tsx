"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Sparkles, Camera, Zap, Clock } from "lucide-react"
import Image from "next/image"

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  // Check if user just completed payment
  const isSuccess = searchParams.get("success") === "true"

  const handleContinue = () => {
    setLoading(true)
    router.push("/wizard/project-name")
  }

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/wizard/welcome" })
  }

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  // If user just paid, show success message and training status
  if (isSuccess && session) {
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

  // Show login screen if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left side - Hero content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Krijg je headshots in <span className="text-orange-500">minuten</span>, niet dagen
                </h1>

                <div className="flex items-center space-x-2">
                  <Image src="/images/logo-icon.png" alt="AI Portret Pro" width={32} height={32} className="rounded" />
                  <span className="text-lg font-semibold text-gray-700">AI Portret Pro</span>
                </div>
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/professional-man-1.jpg"
                      alt="Professional headshot"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/professional-man-2.jpg"
                      alt="Professional headshot"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/professional-woman-1.jpg"
                      alt="Professional headshot"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/professional-man-3.jpg"
                      alt="Professional headshot"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/professional-woman-2.jpg"
                      alt="Professional headshot"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/professional-woman-3.jpg"
                      alt="Professional headshot"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/professional-man-4.jpg"
                      alt="Professional headshot"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src="/images/professional-woman-4.jpg"
                      alt="Professional headshot"
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Trustpilot-style review */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-green-500 text-sm">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Trustpilot</span>
                </div>
                <p className="text-sm text-gray-600 italic mb-2">
                  "Ik was eerst sceptisch, maar de resultaten zijn geweldig! Binnen 20 minuten had ik 40 professionele
                  headshots. Perfect voor mijn LinkedIn profiel."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Thomas van der Berg</span>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="lg:pl-8">
              <Card className="w-full max-w-md mx-auto">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Begin nu</h2>
                    <p className="text-gray-600">Maak je professionele headshots in minuten</p>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleGoogleSignIn}
                      className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white py-3 text-base font-medium"
                      size="lg"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                      Doorgaan met Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OF</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Voer je email adres in"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077B5] focus:border-transparent"
                      />
                      <Button
                        variant="outline"
                        className="w-full py-3 text-base font-medium border-gray-300 hover:bg-gray-50 bg-transparent"
                        size="lg"
                      >
                        Doorgaan met Email
                      </Button>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <p className="text-xs text-gray-500">
                      Nieuwe accounts vallen onder onze{" "}
                      <a href="/terms" className="text-[#0077B5] hover:underline">
                        Voorwaarden
                      </a>{" "}
                      en{" "}
                      <a href="/privacy" className="text-[#0077B5] hover:underline">
                        Privacybeleid
                      </a>
                      .
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span>Beveiliging voor Fortune 500 bedrijven</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <span>100% Geld Terug Garantie</span>
                      </div>
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

  // Show welcome content for authenticated users (not from payment success)
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
