"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Pack {
  id: string
  name: string
  description?: string
  image_url?: string
  likes?: number
  category?: string
}

export default function SelectPackPage() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPack, setSelectedPack] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await fetch("/api/astria/packs")
        const data = await response.json()

        // Use headshot packs if available, otherwise all packs
        setPacks(data.headshot_packs?.length > 0 ? data.headshot_packs : data.all_packs || [])
      } catch (error) {
        console.error("Error fetching packs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPacks()
  }, [])

  const handleContinue = () => {
    if (selectedPack) {
      const existingData = JSON.parse(localStorage.getItem("wizardData") || "{}")
      localStorage.setItem(
        "wizardData",
        JSON.stringify({
          ...existingData,
          selectedPackId: selectedPack,
          step: 1,
        }),
      )
      router.push("/use-credit/project-name")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choose Your Style</CardTitle>
            <p className="text-gray-600">Select the headshot style that best fits your needs</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {packs.map((pack) => (
            <Card
              key={pack.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPack === pack.id ? "ring-2 ring-[#0077B5] bg-blue-50" : ""
              }`}
              onClick={() => setSelectedPack(pack.id)}
            >
              <CardHeader>
                {pack.image_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={pack.image_url || "/placeholder.svg"}
                      alt={pack.name}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-lg">{pack.name}</CardTitle>
                {pack.description && <p className="text-sm text-gray-600">{pack.description}</p>}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {pack.likes && <Badge variant="secondary">❤️ {pack.likes} likes</Badge>}
                  {selectedPack === pack.id && <div className="w-4 h-4 bg-[#0077B5] rounded-full"></div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedPack}
            className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-3"
          >
            Continue with Selected Style
          </Button>

          <Button variant="ghost" onClick={() => router.push("/use-credit")}>
            ← Back
          </Button>
        </div>
      </div>
    </div>
  )
}
