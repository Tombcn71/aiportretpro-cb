"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function WelcomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session) {
      // User is authenticated, we can proceed
      console.log("User authenticated:", session.user?.email)
    }
  }, [status, router, session])

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return null
  }

  const handleContinue = () => {
    setIsLoading(true)
    router.push("/wizard/project-name")
  }

  // Headshot images for collage - reduced to 6 photos
  const headshotImages = [
    "/images/man1.jpg",
    "/images/woman1.jpg",
    "/images/man2.jpg",
    "/images/woman2.jpg",
    "/images/man3.jpg",
    "/images/woman3.jpg",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        

        <Card className="border-[#0077B5]/20 shadow-xl">
          <CardContent className="p-6 md:p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>

            {/* Welcome Text */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Welkom bij AI Portret Pro!</h1>

            <p className="text-base text-gray-600 mb-6 max-w-xl mx-auto">
              Laten we je professionele headshots maken! Upload je foto's en krijg 40 professionele portretfoto's in slechts 15 minuten.
            </p>

            {/* Headshot Collage - 2x3 grid with 6 photos */}
            <div className="mb-6">
              

              <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto">
                {headshotImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden shadow-sm border border-[#0077B5]/20 hover:border-[#0077B5]/40 transition-colors"
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

            

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={isLoading}
              size="lg"
              className=" bg-[#FF8C00] hover:bg-[#FFA500] text-white px-6 py-3 text-base font-semibold"
            >
              {isLoading ? "Laden..." : "Laten we beginnen"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
