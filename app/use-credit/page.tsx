"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"

interface UserCredits {
  credits: number
}

export default function UseCreditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [credits, setCredits] = useState<UserCredits>({ credits: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchCredits()
    }
  }, [status, router])

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits/balance")
      if (!response.ok) {
        throw new Error("Failed to fetch credits")
      }
      const data = await response.json()
      setCredits(data)
    } catch (error) {
      console.error("Error fetching credits:", error)
      setCredits({ credits: 0 })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Gebruik je tegoed</h1>
          <p className="text-gray-600">Start een nieuw project met je beschikbare tegoed</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-r from-[#0077B5] to-[#004182] text-white mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Jouw Tegoed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{credits.credits}</p>
                <p className="text-blue-100">{credits.credits === 1 ? "credit beschikbaar" : "credits beschikbaar"}</p>
              </div>
            </CardContent>
          </Card>

          {credits.credits > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Start nieuw project</h3>
                  <p className="text-gray-600 mb-4">Gebruik 1 credit om professionele portetfotos te maken</p>
                  <Link href="/use-credit/project-name">
                    <Button className="w-full bg-[#0077B5] hover:bg-[#004182] text-white">
                      Start Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Geen tegoed beschikbaar</h3>
                  <p className="text-gray-600 mb-4">Je hebt geen credits meer. Koop nieuwe credits om door te gaan.</p>
                  <Link href="/pricing">
                    <Button className="w-full bg-[#0077B5] hover:bg-[#004182] text-white">
                      Koop Credits
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
