"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestWebhookPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testManualFetch = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/astria/manual-fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: 42, // Tom's test project
        }),
      })

      const data = await response.json()
      setResult(data)
      console.log("Manual fetch result:", data)
    } catch (error) {
      console.error("Error:", error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testWebhookSimulation = async () => {
    setLoading(true)
    try {
      // Simulate what Astria sends based on your example
      const mockAstriaData = {
        prompt: {
          id: 27477213,
          images: [
            "https://api.astria.ai/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCS2xraXdvPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--02c7a5b999bcbfba92d5a3c54ecdc3271b51b3a4/27477213-0.jpg",
            "https://api.astria.ai/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCS3BraXdvPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--dc6c6dd11e4b5607fb77103e515edbfb6ed072d4/27477213-1.jpg",
          ],
        },
      }

      const response = await fetch("/api/astria/prompt-webhook?model_id=2955915&webhook_secret=shadf892yr32548hq23h", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockAstriaData),
      })

      const data = await response.json()
      setResult(data)
      console.log("Webhook simulation result:", data)
    } catch (error) {
      console.error("Error:", error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Webhook & Manual Fetch</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Manual Fetch Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Test manual fetch voor project #42 (Tom's test fotoshoot)</p>
              <Button onClick={testManualFetch} disabled={loading} className="w-full">
                {loading ? "Fetching..." : "🔄 Test Manual Fetch"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Simuleer een Astria webhook met test data</p>
              <Button onClick={testWebhookSimulation} disabled={loading} className="w-full">
                {loading ? "Testing..." : "🧪 Test Webhook"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Test manual fetch eerst (gratis)</li>
                <li>Als dat werkt, test webhook simulation</li>
                <li>Check /dashboard om te zien of foto's verschijnen</li>
                <li>Pas dan de echte webhook URL aan in Astria</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
