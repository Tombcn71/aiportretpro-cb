"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Loader2, Camera } from "lucide-react"
import { Header } from "@/components/header"

interface FetchResult {
  success: boolean
  project?: {
    id: number
    name: string
    tuneId: string
  }
  tuneStatus?: string
  promptsFound?: number
  imagesFound?: number
  promptDetails?: Array<{
    id: string
    status: string
    imageCount: number
  }>
  sampleImages?: string[]
  message?: string
  error?: string
  details?: string
}

export default function ManualFetchPage() {
  const [projectId, setProjectId] = useState("40") // Default to Tina's project
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FetchResult | null>(null)

  const handleFetch = async () => {
    if (!projectId.trim()) {
      alert("Voer een project ID in")
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/astria/manual-fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: projectId.trim() }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Network error",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">🚨 Noodoplossing: Foto's Ophalen</h1>
          <p className="text-center text-gray-600">Haal direct foto's op van Astria API als webhooks niet werken</p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Foto's Ophalen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Project ID (bijv. 40 voor Tina)"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleFetch} disabled={loading} className="bg-[#0077B5] hover:bg-[#004182]">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Bezig...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Haal Foto's Op
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">💡 Tip: Project ID 40 is voor "Tina" - probeer die eerst</p>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Resultaat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-4">
                  {/* Success Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">✅ Succesvol!</h3>
                    <p className="text-green-700">{result.message}</p>
                  </div>

                  {/* Project Details */}
                  {result.project && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Project</p>
                        <p className="font-semibold">{result.project.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tune Status</p>
                        <Badge variant={result.tuneStatus === "succeeded" ? "default" : "secondary"}>
                          {result.tuneStatus}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Prompts</p>
                        <p className="font-semibold">{result.promptsFound}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Foto's</p>
                        <p className="font-semibold text-green-600">{result.imagesFound}</p>
                      </div>
                    </div>
                  )}

                  {/* Prompt Details */}
                  {result.promptDetails && result.promptDetails.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Prompt Details:</h4>
                      <div className="grid gap-2">
                        {result.promptDetails.map((prompt, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-sm">Prompt {prompt.id}</span>
                            <div className="flex gap-2">
                              <Badge variant="outline">{prompt.status}</Badge>
                              <Badge variant="secondary">{prompt.imageCount} foto's</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sample Images */}
                  {result.sampleImages && result.sampleImages.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Voorbeeld Foto's:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {result.sampleImages.map((imageUrl, index) => (
                          <img
                            key={index}
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Sample ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📋 Volgende Stappen:</h4>
                    <ol className="list-decimal list-inside text-blue-700 space-y-1">
                      <li>Ga terug naar je dashboard</li>
                      <li>Ververs de pagina (F5)</li>
                      <li>Je foto's zouden nu zichtbaar moeten zijn!</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Error Info */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Fout</h3>
                    <p className="text-red-700">{result.error}</p>
                    {result.details && <p className="text-red-600 text-sm mt-2">{result.details}</p>}
                  </div>

                  {/* Troubleshooting */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">🔧 Mogelijke Oplossingen:</h4>
                    <ul className="list-disc list-inside text-yellow-700 space-y-1">
                      <li>Controleer of het project ID correct is</li>
                      <li>Het project moet een Astria tune_id hebben</li>
                      <li>De training moet zijn gestart in Astria</li>
                      <li>Probeer het over een paar minuten opnieuw</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📖 Instructies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Voor Project "Tina" (ID: 40):</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Laat "40" staan in het veld</li>
                  <li>Klik op "Haal Foto's Op"</li>
                  <li>Wacht op het resultaat</li>
                  <li>Ga terug naar dashboard als succesvol</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Voor Andere Projecten:</h4>
                <p className="text-sm text-gray-600">
                  Voer het project ID in dat je wilt controleren. Je kunt project IDs vinden in je dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
