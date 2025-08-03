"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Shield, Check } from "lucide-react"
import Image from "next/image"

export default function ReviewPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [projectData, setProjectData] = useState<any>(null)

  useEffect(() => {
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Load project data from sessionStorage
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const uploadedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

    if (!projectName || !gender || uploadedPhotos.length < 6) {
      router.push("/wizard/upload")
      return
    }

    setProjectData({
      projectName,
      gender,
      uploadedPhotos,
    })
  }, [session, router])

  const handleContinue = () => {
    // Store selected plan (always professional since there's only one)
    sessionStorage.setItem("selectedPlan", "professional")
    router.push("/wizard/checkout")
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/wizard/upload")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professionele headshots wachten op je!</h1>
          <p className="text-gray-600">
            Krijg binnen 15 minuten 40 professionele portretfoto's. Betaal eenmalig, geen abonnementen.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Review */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Jouw Bestelling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Project Naam</p>
                  <p className="font-medium">{projectData.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Geslacht</p>
                  <p className="font-medium capitalize">{projectData.gender === "man" ? "Man" : "Vrouw"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Foto's Geüpload</p>
                  <p className="font-medium">{projectData.uploadedPhotos.length} foto's</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {projectData.uploadedPhotos.slice(0, 6).map((photo: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Foto ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {projectData.uploadedPhotos.length > 6 && (
                  <p className="text-sm text-gray-500">+{projectData.uploadedPhotos.length - 6} meer foto's</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Professional Plan */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-[#0077B5] shadow-lg relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#0077B5] text-white px-4 py-1">Meest Populair</Badge>
              </div>

              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-bold text-[#0077B5]">€19,99</span>
                </div>
                <p className="text-gray-600 mt-2">Eenmalige betaling, geen abonnement</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">40 professionele portretfoto's</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Verschillende zakelijke outfits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Verschillende poses en achtergronden</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>HD kwaliteit downloads</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Klaar binnen 15 minuten</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Perfect voor LinkedIn, Social Media, CV, Website en Print</span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-6">
                  <h4 className="font-semibold text-lg mb-3">Betaal Veilig & Start Direct</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Veilige betaling met iDEAL en credit card</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Geld terug garantie</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">100% Geld Terug Garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">Google Reviews</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-1 font-semibold">4.8</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">TrustPilot</span>
                  <div className="flex text-green-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-1 font-semibold">4.8</span>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-[#0077B5] hover:bg-[#004182] text-white px-12 py-4 text-lg font-semibold w-full max-w-md"
              >
                Start Nu - €19,99
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Veilige betaling via Stripe. Je foto's worden direct na betaling verwerkt.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div>
                <div className="flex text-green-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "Ik ben zo blij en verbaasd over hoeveel prachtige resultaten er werden gegenereerd. Deze foto's
                  vertegenwoordigen mijn echte zelf perfect voor mijn LinkedIn profiel!"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
