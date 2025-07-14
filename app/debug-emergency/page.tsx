"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, Search, Database } from "lucide-react"

export default function DebugEmergencyPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleDebugFetch = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/astria/debug-emergency", {
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
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">🔍 DEBUG NOODREDDING</h1>
          <p className="text-blue-700 text-lg">Laten we zien wat Astria API precies teruggeeft</p>
        </div>

        <Card className="mb-6 border-blue-200">
          <CardHeader className="bg-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Bug className="h-6 w-6" />
              Debug Astria API Response
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🎯 Wat dit doet:</h3>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Toont EXACTE API response van Astria</li>
                  <li>• Controleert tune 2951161 status</li>
                  <li>• Laat zien waar de foto's zitten</li>
                  <li>• Helpt ons begrijpen waarom "No images found"</li>
                </ul>
              </div>

              <Button
                onClick={handleDebugFetch}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Search className="h-5 w-5 mr-2 animate-spin" />
                    BEZIG MET DEBUG...
                  </>
                ) : (
                  <>
                    <Bug className="h-5 w-5 mr-2" />🔍 DEBUG ASTRIA API
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
                <Database className="h-6 w-6" />
                Debug Resultaten
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {result.success ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">✅ API Verbinding OK</h3>
                      <p className="text-green-700">Tune ID: {result.tuneId}</p>
                      <p className="text-green-700">API Key: {result.apiKey}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">📊 Prompts Response:</h3>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>
                          <strong>Status:</strong> {result.promptsResponse.status}
                        </p>
                        <p>
                          <strong>Data Type:</strong> {result.promptsResponse.dataType}
                        </p>
                        <p>
                          <strong>Is Array:</strong> {result.promptsResponse.isArray ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Length:</strong> {result.promptsResponse.length}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">🔍 RAW API Data:</h3>
                      <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                        {JSON.stringify(result.promptsResponse.data, null, 2)}
                      </pre>
                    </div>

                    {result.tuneResponse && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h3 className="font-semibold text-purple-800 mb-2">🎵 Tune Data:</h3>
                        <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                          {JSON.stringify(result.tuneResponse.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ Debug Fout</h3>
                    <p className="text-red-700">{result.error}</p>
                    {result.details && <p className="text-red-600 text-sm mt-2">{result.details}</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 bg-orange-100 border border-orange-200 rounded-lg p-6">
          <h3 className="font-semibold text-orange-800 mb-3">💡 Database Herstel Opties:</h3>
          <div className="text-orange-700 space-y-2">
            <p>
              <strong>Neon Database Backup:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Ga naar je Neon dashboard</li>
              <li>Selecteer je database</li>
              <li>Klik op "Branches" of "Point-in-time recovery"</li>
              <li>Kies een datum van vóór de problemen</li>
              <li>Restore naar die versie</li>
            </ol>
            <p className="mt-3 text-sm">
              <strong>Let op:</strong> Dit zet ALLES terug naar die datum!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
