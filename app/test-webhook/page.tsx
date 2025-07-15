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
          projectId: 42,
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
      // Simulate what Astria sends based on your actual response
      const mockAstriaData = {
        prompt: {
          id: 27826412,
          tune_id: 1504944,
          status: "succeeded",
          images: [
            "https://mp.astria.ai/i2r2nxnfcql9y0a275tm8w00dzu7",
            "https://mp.astria.ai/miutwrn6ablzka0cq3hblg3hkp5v",
            "https://mp.astria.ai/9dm59qqrbt3w5epp88faxct18dm2",
          ],
          tunes: [
            {
              id: 2955915,
              title: "toms test fotoshoot",
              model_type: "lora",
              name: "man",
              branch: "flux1",
            },
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

  const fixDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/database/fix-json", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
      console.log("Fix database result:", data)
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>✅ Manual Fetch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Test manual fetch voor project #42 (werkt!)</p>
              <Button onClick={testManualFetch} disabled={loading} className="w-full">
                {loading ? "Fetching..." : "🔄 Test Manual Fetch"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🧪 Webhook Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Simuleer een Astria webhook</p>
              <Button onClick={testWebhookSimulation} disabled={loading} className="w-full">
                {loading ? "Testing..." : "🧪 Test Webhook"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔧 Fix Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Fix malformed JSON in database</p>
              <Button onClick={fixDatabase} disabled={loading} className="w-full">
                {loading ? "Fixing..." : "🔧 Fix Database"}
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
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>✅ Success! Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Manual Fetch Works!</h4>
                  <p className="text-sm text-green-700">Found 40 photos and saved them to the database.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Webhook URL Fix Needed</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    In Astria, update the webhook URL to use the correct model_id:
                  </p>
                  <code className="text-xs bg-blue-100 p-2 rounded block">
                    https://www.aiportretpro.nl/api/astria/prompt-webhook?user_id=1&model_id=2955915&webhook_secret=shadf892yr32548hq23h
                  </code>
                  <p className="text-xs text-blue-600 mt-2">Changed model_id from 42 to 2955915 (the actual tune_id)</p>
                </div>

                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Test webhook simulation above</li>
                  <li>Go to /dashboard to see the 40 photos</li>
                  <li>Update webhook URL in Astria dashboard</li>
                  <li>Test with a new generation</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
