"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UseCreditPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [userCredits, setUserCredits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCredits = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/credits/balance")
          const data = await response.json()
          setUserCredits(data.credits || 0)
        } catch (error) {
          console.error("Error fetching credits:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCredits()
  }, [session])

  const handleStartPhotoshoot = () => {
    if (userCredits < 1) {
      router.push("/pricing")
      return
    }

    // Clear any existing wizard data
    localStorage.removeItem("wizardData")
    router.push("/use-credit/project-name")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Maak Professionele Portetfotos</CardTitle>
          <div className="mt-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              Credits: {userCredits}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Professionele Zakelijke Portetfotos</h3>
            <p className="text-gray-600 text-sm">
              Hoge kwaliteit zakelijke portretten perfect voor LinkedIn, websites en professioneel gebruik
            </p>
          </div>

          {userCredits >= 1 ? (
            <Button onClick={handleStartPhotoshoot} className="w-full bg-[#0077B5] hover:bg-[#004182] text-white">
              Gebruik 1 Credit - Start Fotoshoot
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600">Je hebt credits nodig om portetfotos te maken</p>
              <Button
                onClick={() => router.push("/pricing")}
                className="w-full bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                Koop Credits
              </Button>
            </div>
          )}

          <div className="text-center text-xs text-gray-500">Elke fotoshoot genereert 40 professionele portetfotos</div>
        </CardContent>
      </Card>
    </div>
  )
}
