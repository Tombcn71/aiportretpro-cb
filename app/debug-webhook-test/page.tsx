"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function WebhookTestPage() {
  const [projectId, setProjectId] = useState("39")
  const [webhookBody, setWebhookBody] = useState(`{
  "id": "test-123",
  "status": "finished",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}`)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testWebhook = async () => {
    setLoading(true)
    try {
      // We gebruiken een test secret omdat we de echte secret niet client-side kunnen gebruiken
      const webhookUrl = `/api/astria/prompt-webhook?user_id=1&model_id=${projectId}&webhook_secret=test-secret`

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: webhookBody,
      })

      const responseText = await response.text()
      setResult(`Status: ${response.status}\nResponse: ${responseText}`)
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testSimpleWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/test-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: true, timestamp: new Date().toISOString() }),
      })

      const responseText = await response.text()
      setResult(`Status: ${response.status}\nResponse: ${responseText}`)
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Webhook Testing</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Webhook Handler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project ID</label>
              <Input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Enter project ID" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Webhook Body (JSON)</label>
              <Textarea
                value={webhookBody}
                onChange={(e) => setWebhookBody(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testWebhook} disabled={loading}>
                {loading ? "Testing..." : "Test Astria Webhook"}
              </Button>
              <Button onClick={testSimpleWebhook} disabled={loading} variant="outline">
                Test Simple Webhook
              </Button>
            </div>

            {result && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Result</label>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debugging Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded">
                <p className="font-semibold">1. Test Simple Webhook</p>
                <p>Dit test of de webhook endpoint bereikbaar is</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <p className="font-semibold">2. Test Astria Webhook</p>
                <p>Dit test de webhook handler met sample data (zal falen door verkeerde secret, dat is normaal)</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="font-semibold">3. Check Debug Dashboard</p>
                <p>Ga naar /debug-astria om te zien of er logs verschijnen</p>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <p className="font-semibold">4. Check Astria Configuration</p>
                <p>Als manual tests werken maar Astria niet, dan is het probleem bij Astria's webhook configuratie</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expected Webhook URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gray-100 rounded font-mono text-sm">
              https://www.aiportretpro.nl/api/astria/prompt-webhook?user_id=1&model_id=PROJECT_ID&webhook_secret=shadf892yr32548hq23h
            </div>
            <p className="text-sm text-gray-600 mt-2">Dit is de URL die Astria zou moeten gebruiken voor webhooks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
