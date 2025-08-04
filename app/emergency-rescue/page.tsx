"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Download, ImageIcon } from "lucide-react"

interface RescueResult {
  success: boolean
  message?: string
  error?: string
  details?: string
  project?: {
    id: number
    name: string
    status: string
    photoCount: number
  }
  images?: string[]
}

export default function EmergencyRescuePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RescueResult | null>(null)

  const handleRescue = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/astria/emergency-fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Network error",
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">🚨 NOODREDDING FOTO'S</h1>
          <p className="text-lg text-gray-700">Red je foto's van Astria tune 2951161 (Tina project)</p>
        </div>

        <Card className="mb-8 border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Emergency Rescue Protocol
            </CardTitle>
            <CardDescription>
              Dit gaat direct je foto's ophalen van Astria API en opslaan in de database
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Target Info:</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    • Tune ID: <Badge variant="outline">2951161</Badge>
                  </div>
                  <div>
                    • Project: <Badge variant="outline">40 (Tina)</Badge>
                  </div>
                  <div>
                    • Expected: <Badge variant="outline">40 foto's</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Actie Plan:</h3>
                <div className="space-y-1 text-sm">
                  <div>• Fetch van Astria API</div>
                  <div>• Parse alle prompts</div>
                  <div>• Opslaan in database</div>
                  <div>• Status update naar "completed"</div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleRescue}
              disabled={isLoading}
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Foto's aan het redden...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  RED FOTO'S NU!
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`border-2 ${result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${result.success ? "text-green-700" : "text-red-700"}`}>
                {result.success ? (
                  <>
                    <CheckCircle className="h-5 w-5" />✅ Rescue Succesvol!
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5" />❌ Rescue Mislukt
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-4">
                  <p className="text-green-800 font-medium">{result.message}</p>

                  {result.project && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold mb-2">Project Details:</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>ID: {result.project.id}</div>
                        <div>Naam: {result.project.name}</div>
                        <div>
                          Status: <Badge variant="outline">{result.project.status}</Badge>
                        </div>
                        <div>
                          Foto's: <Badge className="bg-green-100 text-green-800">{result.project.photoCount}</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.images && result.images.length > 0 && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Opgeslagen Foto's ({result.images.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                        {result.images.slice(0, 8).map((url, index) => (
                          <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                            <div className="truncate">#{index + 1}</div>
                            <div className="text-gray-500 truncate">{url.split("/").pop()}</div>
                          </div>
                        ))}
                        {result.images.length > 8 && (
                          <div className="text-xs p-2 bg-gray-100 rounded border flex items-center justify-center">
                            +{result.images.length - 8} meer...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-800 font-medium">🎉 Ga nu naar je dashboard om de foto's te bekijken!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-800 font-medium">{result.error}</p>
                  {result.details && (
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <h3 className="font-semibold mb-2">Error Details:</h3>
                      <pre className="text-xs text-red-700 whitespace-pre-wrap">{result.details}</pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
