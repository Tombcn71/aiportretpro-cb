"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Download, CheckCircle, XCircle } from "lucide-react"

export default function EmergencyRescuePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleEmergencyFetch = async () => {
    setLoading(true)
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
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-red-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-red-900 mb-2">🚨 NOODREDDING</h1>
          <p className="text-red-700 text-lg">Direct foto's redden van Astria tune 2951161</p>
        </div>

        <Card className="mb-6 border-red-200">
          <CardHeader className="bg-red-100">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-6 w-6" />
              Emergency Foto Rescue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🎯 Wat dit doet:</h3>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Haalt DIRECT foto's op van tune 2951161</li>
                  <li>• Slaat ze op in project 40 ("tina")</li>
                  <li>• Zet status op "completed"</li>
                  <li>• Geen database reparatie nodig</li>
                </ul>
              </div>

              <Button
                onClick={handleEmergencyFetch}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Download className="h-5 w-5 mr-2 animate-spin" />
                    BEZIG MET REDDEN...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 mr-2" />🚨 RED FOTO'S NU!
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className={result.success ? "border-green-200" : "border-red-200"}>
            <CardHeader className={result.success ? "bg-green-100" : "bg-red-100"}>
              <CardTitle className={`flex items-center gap-2 ${result.success ? "text-green-800" : "text-red-800"}`}>
                {result.success ? (
                  <>
                    <CheckCircle className="h-6 w-6" />🎉 GELUKT!
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6" />❌ FOUT
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {result.success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">✅ SUCCESS!</h3>
                    <p className="text-green-700 font-medium">{result.message}</p>
                    <p className="text-green-600 text-sm mt-2">{result.status}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.photosCount}</div>
                      <div className="text-sm text-blue-800">Foto's Gered</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.tuneId}</div>
                      <div className="text-sm text-purple-800">Tune ID</div>
                    </div>
                  </div>

                  {result.photos && result.photos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">🖼️ Eerste 4 Geredde Foto's:</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {result.photos.slice(0, 4).map((imageUrl: string, index: number) => (
                          <img
                            key={index}
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Rescued photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=80&width=80&text=Error"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 Volgende Stappen:</h4>
                    <ol className="list-decimal list-inside text-blue-700 space-y-1">
                      <li>
                        Ga naar je{" "}
                        <a href="/dashboard" className="underline font-medium hover:text-blue-900">
                          dashboard
                        </a>
                      </li>
                      <li>Ververs de pagina (F5)</li>
                      <li>Project "tina" zou nu {result.photosCount} foto's moeten tonen</li>
                      <li>🎉 Klaar! Je geld is niet verspild!</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Fout</h3>
                    <p className="text-red-700">{result.error}</p>
                    {result.details && <p className="text-red-600 text-sm mt-2">{result.details}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 bg-red-100 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-800 mb-3">🚨 NOODPROTOCOL:</h3>
          <ul className="text-red-700 space-y-2">
            <li>
              • <strong>Tune ID:</strong> 2951161 (uit jouw screenshot)
            </li>
            <li>
              • <strong>Project:</strong> 40 ("tina")
            </li>
            <li>
              • <strong>Actie:</strong> Direct foto URLs ophalen en opslaan
            </li>
            <li>
              • <strong>Geen database reparatie</strong> - gewoon foto's redden!
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
