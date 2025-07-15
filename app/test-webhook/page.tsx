"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestWebhookPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testWebhook = async () => {
    setLoading(true)
    try {
      // Test webhook met fake data
      const response = await fetch("/api/astria/prompt-webhook?model_id=2955915&webhook_secret=shadf892yr32548hq23h", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: {
            id: 123,
            tune_id: 2955915,
            images: ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
            status: "succeeded",
          },
        }),
      })

      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const manualFetch = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/astria/manual-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: 42 }),
      })

      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-x-2">
            <Button onClick={testWebhook} disabled={loading}>
              Test Webhook
            </Button>
            <Button onClick={manualFetch} disabled={loading} variant="outline">
              Manual Fetch Project 42
            </Button>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
