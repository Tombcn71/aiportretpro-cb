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
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-red-900 mb-2">🚨 NOODREDDING FOTO'S</h1>
          <p className="text-red-700 text-lg">Red je foto's van Tina (Project 40) direct uit Astria API</p>
        </div>

        <Card className="mb-6 border-red-200">
          <CardHeader className="bg-red-100">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-6 w-6" />
              Emergency Photo Rescue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🎯 Wat dit doet:</h3>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Haalt ALLE 40 foto's op van tune 2951161</li>
                  <li>• Slaat ze op in project 40 (Tina) database</li>
                  <li>• Zet status op "completed"</li>
                  <li>• Maakt dashboard weer werkend</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📊 Gedetecteerde Data:</h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• Tune ID: 2951161 ✅</li>
                  <li>• Project ID: 40 (Tina) ✅</li>
                  <li>• Prompts: 5 stuks ✅</li>
                  <li>• Foto's per prompt: 8 stuks ✅</li>
                  <li>• Totaal foto's: 40 stuks ✅</li>
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
                    <AlertTriangle className="h-6 w-6 mr-2" />🚨 RED FOTO'S NU!
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
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
                Rescue Resultaten
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {result.success ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">🎉 SUCCES!</h3>
                      <p className="text-green-700 text-lg">{result.message}</p>
                      <div className="mt-3 text-green-700 space-y-1">
                        <p>
                          <strong>Project:</strong> {result.project?.name} (ID: {result.project?.id})
                        </p>
                        <p>
                          <strong>Status:</strong> {result.project?.status}
                        </p>
                        <p>
                          <strong>Foto's opgeslagen:</strong> {result.project?.photoCount}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">📸 Opgeslagen Foto's:</h3>
                      <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                        {result.images?.slice(0, 16).map((imageUrl: string, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={imageUrl || "/placeholder.svg"}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=80&width=80&text=Error"
                              }}
                            />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-tr">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      {result.images?.length > 16 && (
                        <p className="text-blue-600 text-sm mt-2">En nog {result.images.length - 16} foto's meer...</p>
                      )}
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-800 mb-2">🎯 Volgende Stappen:</h3>
                      <ol className="text-purple-700 space-y-1 list-decimal list-inside">
                        <li>Ga naar je dashboard</li>
                        <li>Project "Tina" zou nu "completed" status moeten hebben</li>
                        <li>Je foto's zouden zichtbaar moeten zijn</li>
                        <li>Test of alles werkt zoals verwacht</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Rescue Mislukt</h3>
                    <p className="text-red-700">{result.error}</p>
                    {result.details && <p className="text-red-600 text-sm mt-2">{result.details}</p>}
                    {result.debug && (
                      <div className="mt-3">
                        <h4 className="font-medium text-red-800">Debug Info:</h4>
                        <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-auto">
                          {JSON.stringify(result.debug, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 bg-orange-100 border border-orange-200 rounded-lg p-6">
          <h3 className="font-semibold text-orange-800 mb-3">⚠️ Belangrijk:</h3>
          <div className="text-orange-700 space-y-2">
            <p>Deze noodredding gebruikt de exacte data structuur die we in de debug hebben gezien:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Tune ID: 2951161 (uit jouw screenshot)</li>
              <li>5 prompts met elk 8 foto's = 40 foto's totaal</li>
              <li>Foto URLs zitten direct in de "images" array</li>
              <li>Wordt opgeslagen in generated_photos kolom als JSON</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
