"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function WizardWelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/wizard/login")
    }
  }, [status, router])

  const handleStartPhotoshoot = async () => {
    setIsLoading(true)

    try {
      // Initialize wizard session
      const response = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: "welcome",
          data: {
            userId: session?.user?.email,
            startedAt: new Date().toISOString(),
          },
        }),
      })

      if (response.ok) {
        router.push("/wizard/project-name")
      }
    } catch (error) {
      console.error("Error starting wizard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl text-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Welkom bij onze portretfoto generator
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
          Onze AI tovert jou gewone foto's om in professionele portretfoto's.
        </p>
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Perfect voor LinkedIn, Social Media, CV, Website en Print
        </p>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src="/images/professional-man-1.jpg"
              alt="Professional headshot man"
              width={300}
              height={400}
              className="w-full h-full object-cover brightness-110 contrast-105"
            />
          </div>
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src="/images/professional-woman-1.jpg"
              alt="Professional headshot woman"
              width={300}
              height={400}
              className="w-full h-full object-cover brightness-110 contrast-105"
            />
          </div>
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src="/images/professional-woman-2.jpg"
              alt="Professional headshot woman"
              width={300}
              height={400}
              className="w-full h-full object-cover brightness-110 contrast-105"
            />
          </div>
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src="/images/professional-man-2.jpg"
              alt="Professional headshot man"
              width={300}
              height={400}
              className="w-full h-full object-cover brightness-110 contrast-105"
            />
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStartPhotoshoot}
          disabled={isLoading}
          className="bg-[#FF8C00] hover:bg-[#E67E00] text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Bezig...
            </div>
          ) : (
            "begin fotoshoot"
          )}
        </Button>

        {/* Welcome Message */}
        {session?.user?.name && (
          <p className="text-gray-600 mt-6">
            Welkom, {session.user.name}! Laten we beginnen met het maken van jouw professionele portretfoto's.
          </p>
        )}
      </div>
    </div>
  )
}
