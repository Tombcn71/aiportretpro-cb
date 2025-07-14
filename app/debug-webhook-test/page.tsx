"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugWebhookTestPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<string | null>(null)

  const testWebhook = async (type: string) => {
    setLoading(type)
    try {
      let url = ""
      switch (type) {
        case "simple":
          url = "/api/debug/test-webhook"
          break
        case "astria-wrong":
          // Test with wrong secret
          url = `/api/astria/prompt-webhook?user_id=1&model_id=39&webhook_secret=wrong_secret`
          break
        case "astria-correct":
          url = "/api/debug/test-astria-webhook"
          break
      }

      const response = await fetch(url, {
        method: type === "astria-wrong" ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          type === "astria-wrong"
            ? JSON.stringify({
                id: "test-123",
                status: "completed",
                images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
              })
            : undefined,
      })

      const data = await response.json()
      setResults((prev) => ({
        ...prev,
        [type]: {
          status: response.status,
          data,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [type]: {
          status: "error",
          data: { error: error.message },
        },
      }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Webhook Test Dashboard</h1>

        <div className="grid gap-6">
          {/* Simple Webhook Test */}
          <Card>
            <CardHeader>
              <CardTitle>Simple Webhook Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => testWebhook("simple")} disabled={loading === "simple"} className="mb-4">
                {loading === "simple" ? "Testing..." : "Test Simple Webhook"}
              </Button>
              {results.simple && (
                <div className="bg-gray-100 p-4 rounded">
                  <p>
                    <strong>Status:</strong> {results.simple.status}
                  </p>
                  <p>
                    <strong>Response:</strong> {JSON.stringify(results.simple.data)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Astria Webhook Test (Wrong Secret) */}
          <Card>
            <CardHeader>
              <CardTitle>Astria Webhook Test (Wrong Secret)</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => testWebhook("astria-wrong")}
                disabled={loading === "astria-wrong"}
                className="mb-4"
                variant="destructive"
              >
                {loading === "astria-wrong" ? "Testing..." : "Test Astria Webhook (Wrong Secret)"}
              </Button>
              {results["astria-wrong"] && (
                <div className="bg-gray-100 p-4 rounded">
                  <p>
                    <strong>Status:</strong> {results["astria-wrong"].status}
                  </p>
                  <p>
                    <strong>Response:</strong> {JSON.stringify(results["astria-wrong"].data)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Astria Webhook Test (Correct Secret) */}
          <Card>
            <CardHeader>
              <CardTitle>Astria Webhook Test (Correct Secret)</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => testWebhook("astria-correct")}
                disabled={loading === "astria-correct"}
                className="mb-4"
                variant="default"
              >
                {loading === "astria-correct" ? "Testing..." : "Test Astria Webhook (Correct Secret)"}
              </Button>
              {results["astria-correct"] && (
                <div className="bg-gray-100 p-4 rounded">
                  <p>
                    <strong>Status:</strong> {results["astria-correct"].status}
                  </p>
                  <p>
                    <strong>Response:</strong> {JSON.stringify(results["astria-correct"].data, null, 2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environment Check */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Test URL:</strong> /api/astria/prompt-webhook
                </p>
                <p>
                  <strong>Simple Test URL:</strong> /api/debug/test-webhook
                </p>
                <p className="text-sm text-gray-600">Note: Webhook secret is handled server-side for security</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
