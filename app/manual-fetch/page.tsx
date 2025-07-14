"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Camera, Database, AlertTriangle, Info } from "lucide-react"

export default function ManualFetchPage() {
  const [projectId, setProjectId] = useState("40") // Default to Tina's project
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFetch = async () => {
    if (!projectId) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/astria/manual-fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: Number.parseInt(projectId) }),
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
      setLoading(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    if (success) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "trained":
        return "bg-green-100 text-green-800 border-green-200"
      case "training":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "succeeded":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚨 Noodoplossing: Foto's Handmatig Ophalen</h1>
          <p className="text-gray-600">Haal foto's direct op van Astria API en sla ze op in de database</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Project Ophalen
            </CardTitle>
            <CardDescription>Voer het project ID in om foto's op te halen (Tina = 40)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Project ID (bijv. 40)"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleFetch} disabled={loading || !projectId} className="min-w-[140px]">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ophalen...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Haal Foto's Op
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.success)}
                Resultaat voor Project {result.project?.name || projectId}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Succes!
                    </h3>
                    <p className="text-green-700">{result.message}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{result.photosFound}</div>
                      <div className="text-sm text-blue-800">Foto's Gevonden</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{result.completedPrompts}</div>
                      <div className="text-sm text-green-800">Klaar</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="text-2xl font-bold text-gray-600">{result.totalPrompts}</div>
                      <div className="text-sm text-gray-800">Totaal Prompts</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <Badge className={getStatusColor(result.tuneStatus)}>{result.tuneStatus}</Badge>
                      <div className="text-sm text-purple-800 mt-1">Tune Status</div>
                    </div>
                  </div>

                  {result.samplePhotos && result.samplePhotos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">🖼️ Voorbeeld Foto's:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {result.samplePhotos.map((imageUrl: string, index: number) => (
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Volgende Stappen:
                    </h4>
                    <ol className="list-decimal list-inside text-blue-700 space-y-1">
                      <li>
                        Ga naar je{" "}
                        <a href="/dashboard" className="underline font-medium hover:text-blue-900">
                          dashboard
                        </a>
                      </li>
                      <li>Ververs de pagina (F5 of Ctrl+R)</li>
                      <li>Controleer of de {result.photosFound} foto's nu zichtbaar zijn</li>
                      <li>Als het werkt, kunnen we de webhooks repareren voor toekomstige projecten</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Probleem
                    </h3>
                    <p className="text-red-700">{result.message || result.error}</p>
                    {result.explanation && <p className="text-red-600 text-sm mt-2">{result.explanation}</p>}
                  </div>

                  {result.project && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">📋 Project Info:</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Naam:</strong> {result.project.name}
                        </div>
                        <div>
                          <strong>ID:</strong> {result.project.id}
                        </div>
                        <div>
                          <strong>Tune ID:</strong> {result.project.tuneId || "Niet gevonden"}
                        </div>
                      </div>
                    </div>
                  )}

                  {result.tuneStatus && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Status Info:
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Tune Status: </span>
                          <Badge className={getStatusColor(result.tuneStatus)}>{result.tuneStatus}</Badge>
                        </div>
                        {result.completedPrompts !== undefined && (
                          <div>
                            <span className="font-medium">Prompts: </span>
                            {result.completedPrompts} van {result.totalPrompts} klaar
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {result.promptDetails && result.promptDetails.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">🔍 Prompt Details:</h4>
                      <div className="space-y-1 text-sm">
                        {result.promptDetails.map((prompt: any, index: number) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span>Prompt {prompt.id}:</span>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(prompt.status)}>{prompt.status}</Badge>
                              <span className="text-gray-600">{prompt.imageCount} foto's</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.details && (
                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <summary className="font-semibold text-gray-800 cursor-pointer">🔧 Technische Details</summary>
                      <pre className="mt-2 text-xs text-gray-600 overflow-auto whitespace-pre-wrap">
                        {typeof result.details === "string" ? result.details : JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Info className="h-5 w-5" />
            Hoe dit werkt:
          </h3>
          <ul className="text-blue-700 space-y-2">
            <li>
              • <strong>Stap 1:</strong> Controleert Astria API direct (geen webhooks)
            </li>
            <li>
              • <strong>Stap 2:</strong> Gebruikt prediction_id (2951161) uit database
            </li>
            <li>
              • <strong>Stap 3:</strong> Haalt alle beschikbare foto's op
            </li>
            <li>
              • <strong>Stap 4:</strong> Slaat ze op in database zoals project 23
            </li>
            <li>
              • <strong>Stap 5:</strong> Toont resultaat en volgende stappen
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
