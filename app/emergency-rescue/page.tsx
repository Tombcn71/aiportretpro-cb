"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Download, CheckCircle, AlertTriangle } from "lucide-react"

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
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-red-900 mb-2">🚨 NOODREDDING FOTO'S</h1>
          <p className="text-red-700 text-lg">Red je 40 foto's van Tina (tune 2951161)</p>
        </div>

        <Card className="mb-6 border-red-200">
          <CardHeader className="bg-red-100">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Zap className="h-6 w-6" />
              Emergency Photo Rescue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🎯 Wat dit doet:</h3>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Haalt ALLE 40 foto's op van tune 2951161</li>
                  <li>• Slaat ze op in project 40 database</li>
                  <li>• Zet status op "completed"</li>
                  <li>• Toont je de foto URLs als bevestiging</li>
                  <li>• DIRECT werkend op je dashboard!</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Debug Resultaat:</h3>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• 5 prompts gevonden</li>
                  <li>• 8 foto's per prompt = 40 foto's totaal</li>
                  <li>• Alle foto URLs beschikbaar</li>
                  <li>• API verbinding werkt perfect</li>
                </ul>
              </div>

              <Button
                onClick={handleEmergencyFetch}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-xl"
                size="lg"
              >
                {loading ? (
                  <>
                    <Download className="h-6 w-6 mr-2 animate-spin" />
                    BEZIG MET REDDEN...
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 mr-2" />🚨 RED FOTO'S NU!
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-100">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
                Rescue Resultaten
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {result.success ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">🎉 SUCCESS!</h3>
                      <p className="text-green-700 text-lg">{result.message}</p>
                      <div className="mt-3 text-green-700 space-y-1">
                        <p>
                          <strong>Tune ID:</strong> {result.tuneId}
                        </p>
                        <p>
                          <strong>Project ID:</strong> {result.projectId}
                        </p>
                        <p>
                          <strong>Foto's Opgeslagen:</strong> {result.photosCount}
                        </p>
                        <p>
                          <strong>Status:</strong> {result.status}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">📸 Opgeslagen Foto's:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                        {result.photos.slice(0, 16).map((photo: string, index: number) => (
                          <div key={index} className="text-xs bg-white p-2 rounded border">
                            <p className="truncate">Foto {index + 1}</p>
                            <a
                              href={photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Bekijk
                            </a>
                          </div>
                        ))}
                        {result.photos.length > 16 && (
                          <div className="text-xs bg-gray-100 p-2 rounded border text-center">
                            +{result.photos.length - 16} meer...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-800 mb-2">🎯 Volgende Stappen:</h3>
                      <ol className="text-purple-700 space-y-1 list-decimal list-inside">
                        <li>
                          Ga naar je <strong>/dashboard</strong>
                        </li>
                        <li>Project "tina" zou nu "completed" status moeten hebben</li>
                        <li>Alle 40 foto's zouden zichtbaar moeten zijn</li>
                        <li>Download je foto's!</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Rescue Fout</h3>
                    <p className="text-red-700">{result.error}</p>
                    {result.details && <p className="text-red-600 text-sm mt-2">{result.details}</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 bg-blue-100 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">💡 Na de Redding:</h3>
          <div className="text-blue-700 space-y-2">
            <p>Als dit werkt, kunnen we daarna:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>De webhooks repareren voor toekomstige projecten</li>
              <li>Database schema optimaliseren</li>
              <li>Automatische backup systeem opzetten</li>
            </ul>
            <p className="mt-3 font-semibold">Maar eerst: RED JE FOTO'S! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  )
}
