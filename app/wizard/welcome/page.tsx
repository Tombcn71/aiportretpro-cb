"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"
import Image from "next/image"

export default function WelcomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const sessionId = searchParams.get("session_id")

  const handleContinue = () => {
    setIsLoading(true)
    router.push("/wizard/project-name")
  }

  // Headshot images for collage
  const headshotImages = [
    "/images/man1.jpg",
    "/images/woman1.jpg",
    "/images/man2.jpg",
    "/images/woman2.jpg",
    "/images/man3.jpg",
    "/images/woman3.jpg",
    "/images/man4.jpg",
    "/images/woman4.jpg",
    "/images/man5.jpg",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Stap 1 van 4</span>
            <span>25% voltooid</span>
          </div>
          <ProgressBar progress={25} />
        </div>

        <Card className="border-[#0077B5]/20 shadow-xl">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            {/* Welcome Text */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Welkom!</h1>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Je betaling is succesvol verwerkt. Laten we beginnen met het maken van je professionele headshots!
            </p>

            {/* Headshot Collage */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Voorbeelden van AI-gegenereerde professionele headshots
              </h2>

              <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
                {headshotImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden shadow-md border-2 border-[#0077B5]/20 hover:border-[#0077B5]/40 transition-colors"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Professional headshot example ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Wat gebeurt er nu?</h3>
              <div className="text-left space-y-2 text-gray-600">
                <p>• We gaan je projectnaam instellen</p>
                <p>• Je kiest je geslacht voor de beste resultaten</p>
                <p>• Je uploadt 6+ goede selfies</p>
                <p>• Onze AI gaat aan de slag (15-25 minuten)</p>
                <p>• Je ontvangt 40 professionele headshots!</p>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={isLoading}
              size="lg"
              className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-4 text-lg font-semibold"
            >
              {isLoading ? "Laden..." : "Laten we beginnen"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {sessionId && <p className="text-xs text-gray-500 mt-4">Sessie ID: {sessionId}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
