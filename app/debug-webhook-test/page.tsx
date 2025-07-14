"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function WebhookTestPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<any>({})
  const [projectId, setProjectId] = useState("39")

  const testSimpleWebhook = async () => {
    setLoading({ ...loading, simple: true })
    try {
      const response = await fetch("/api/debug/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "simple webhook", timestamp: new Date().toISOString() }),
      })
      const data = await response.json()
      setResults({ ...results, simple: { status: response.status, data } })
    } catch (error) {
      setResults({ ...results, simple: { status: 500, error: error.message } })
    }
    setLoading({ ...loading, simple: false })
  }

  const testAstriaWebhookWrongSecret = async () => {
    setLoading({ ...loading, wrongSecret: true })
    try {
      const response = await fetch("/api/debug/test-astria-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          testData: {
            id: "test_prompt_123",
            status: "finished",
            images: ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
          },
        }),
      })
      const data = await response.json()
      setResults({ ...results, wrongSecret: { status: response.status, data } })
    } catch (error) {
      setResults({ ...results, wrongSecret: { status: 500, error: error.message } })
    }
    setLoading({ ...loading, wrongSecret: false })
  }

  const testAstriaWebhookCorrectSecret = async () => {
    setLoading({ ...loading, correctSecret: true })
    try {
      const response = await fetch("/api/debug/test-astria-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          testData: {
            id: "test-123",
            status: "completed",
            images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
          },
        }),
      })
      const data = await response.json()
      setResults({ ...results, correctSecret: { status: response.status, data } })
    } catch (error) {
      setResults({ ...results, correctSecret: { status: 500, error: error.message } })
    }
    setLoading({ ...loading, correctSecret: false })
  }

  const renderResult = (key: string, title: string) => {
    const result = results[key]
    if (!result) return null

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Status:</strong>{" "}
              <span className={result.status === 200 ? "text-green-600" : "text-red-600"}>{result.status}</span>
            </p>
            <div>
              <strong>Response:</strong>
              <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(result.data || result.error, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Webhook Test Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Project ID for Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter project ID"
            className="max-w-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simple Webhook Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testSimpleWebhook} disabled={loading.simple}>
            {loading.simple ? "Testing..." : "Test Simple Webhook"}
          </Button>
          {renderResult("simple", "Simple Webhook Result")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Astria Webhook Test (Wrong Secret)</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testAstriaWebhookWrongSecret} disabled={loading.wrongSecret} variant="destructive">
            {loading.wrongSecret ? "Testing..." : "Test Astria Webhook (Wrong Secret)"}
          </Button>
          {renderResult("wrongSecret", "Wrong Secret Result")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Astria Webhook Test (Correct Secret)</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testAstriaWebhookCorrectSecret} disabled={loading.correctSecret} variant="default">
            {loading.correctSecret ? "Testing..." : "Test Astria Webhook (Correct Secret)"}
          </Button>
          {renderResult("correctSecret", "Correct Secret Result")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Test URL:</strong> /api/astria/prompt-webhook
            </p>
            <p>
              <strong>Simple Test URL:</strong> /api/debug/test-webhook
            </p>
            <p className="text-gray-600">
              <strong>Note:</strong> Webhook secret is handled server-side for security
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
