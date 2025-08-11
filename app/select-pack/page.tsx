"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Heart, AlertCircle } from "lucide-react"
import Image from "next/image"

interface Pack {
  id: number
  title: string
  description?: string
  image_url?: string
  likes?: number
  category?: string
  trained_at?: string
  user?: {
    username?: string
  }
}

export default function SelectPackPage() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        console.log("Fetching packs from Astria API...")
        const response = await fetch("/api/astria/packs")

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.message && !data.headshot_packs) {
          throw new Error(data.message)
        }

        console.log(`Received ${data.total_packs} total packs, ${data.headshot_count} headshot packs`)

        // Use headshot packs if available, otherwise all packs
        const packsToShow = data.headshot_packs?.length > 0 ? data.headshot_packs : data.all_packs || []

        // Sort by likes and take top 12
        const sortedPacks = packsToShow.sort((a: any, b: any) => (b.likes || 0) - (a.likes || 0)).slice(0, 12)

        setPacks(sortedPacks)
        setError(null)

        // Auto-select first pack if only one available
        if (sortedPacks.length === 1) {
          setSelectedPack(sortedPacks[0])
        }
      } catch (error) {
        console.error("Error fetching packs:", error)
        setError(error instanceof Error ? error.message : "Failed to load packs")
        setPacks([])
      } finally {
        setLoading(false)
      }
    }

    fetchPacks()
  }, [])

  const handleContinue = () => {
    if (selectedPack) {
      console.log("Selected pack:", selectedPack.id, selectedPack.title)
      // Store selected pack data in localStorage
      localStorage.setItem("selectedPack", JSON.stringify(selectedPack))

      // If coming from checkout, go to wizard
      if (sessionId) {
        router.push("/wizard/project-name")
      } else {
        // Direct access, go to pricing first
        router.push("/pricing")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0077B5] mx-auto mb-4" />
          <p className="text-gray-600">Loading your available packs from Astria...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Cannot Load Packs</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (packs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Packs Available</h2>
            <p className="text-gray-600 mb-4">
              No headshot packs found in your Astria account. You may need to create or purchase packs first.
            </p>
            <Button onClick={() => window.open("https://www.astria.ai", "_blank")} className="w-full">
              Visit Astria.ai
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-[#0077B5]" />
            </div>
            <CardTitle className="text-3xl">Choose Your Professional Style</CardTitle>
            <p className="text-gray-600 text-lg">Select from your available packs ({packs.length} found)</p>
            {sessionId && (
              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                ✅ Payment Confirmed - Choose Your Style
              </Badge>
            )}
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {packs.map((pack) => (
            <Card
              key={pack.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                selectedPack?.id === pack.id ? "ring-2 ring-[#0077B5] bg-blue-50" : ""
              }`}
              onClick={() => setSelectedPack(pack)}
            >
              <CardHeader className="p-0">
                <div className="aspect-video rounded-t-lg overflow-hidden bg-gray-100">
                  <Image
                    src={
                      pack.image_url ||
                      `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(pack.title) || "/placeholder.svg"}`
                    }
                    alt={pack.title}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{pack.title}</h3>
                    {pack.description && <p className="text-sm text-gray-600 line-clamp-2 mt-1">{pack.description}</p>}
                    {pack.user?.username && <p className="text-xs text-gray-500 mt-1">by @{pack.user.username}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        ID: {pack.id}
                      </Badge>
                      {pack.likes && (
                        <Badge variant="secondary" className="text-xs flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{pack.likes}</span>
                        </Badge>
                      )}
                      {pack.trained_at && (
                        <Badge variant="outline" className="text-xs">
                          ✨ Trained
                        </Badge>
                      )}
                    </div>
                    {selectedPack?.id === pack.id && (
                      <div className="w-6 h-6 bg-[#0077B5] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPack && (
          <Card className="mb-8 border-[#0077B5] bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={
                      selectedPack.image_url ||
                      `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(selectedPack.title) || "/placeholder.svg"}`
                    }
                    alt={selectedPack.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#0077B5]">Selected: {selectedPack.title}</h3>
                  {selectedPack.description && <p className="text-gray-600 text-sm">{selectedPack.description}</p>}
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">Pack ID: {selectedPack.id}</Badge>
                    {selectedPack.likes && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{selectedPack.likes} likes</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedPack}
            size="lg"
            className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-4 text-lg"
          >
            {selectedPack ? `Continue with Pack ${selectedPack.id}` : "Select a Pack First"}
          </Button>

          {!sessionId && <p className="text-sm text-gray-500">You'll be redirected to complete your purchase first</p>}
        </div>
      </div>
    </div>
  )
}
