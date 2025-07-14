"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebhookTestPage() {
  const [simpleResult, setSimpleResult] = useState<any>(null)
  const [astriaResult, setAstriaResult] = useState<any>(null)
  const [astriaCorrectResult, setAstriaCorrectResult] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const testSimpleWebhook = async () => {
    setLoading("simple")
    try {
      const response = await fetch("/api/debug/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "simple webhook test" }),
      })
      const data = await response.json()
      setSimpleResult({ status: response.status, data })
    } catch (error) {
      setSimpleResult({ status: "error", data: { error: error.message } })
    }
    setLoading(null)
  }

  const testAstriaWebhookWrong = async () => {
    setLoading("wrong")
    try {
      const response = await fetch("/api/astria/prompt-webhook?user_id=1&model_id=39&webhook_secret=wrong_secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "test-123",
          status: "completed",
          images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        }),
      })

      const data = await response.json()
      setAstriaResult({ status: response.status, data })
    } catch (error) {
      setAstriaResult({ status: "error", data: { error: error.message } })
    }
    setLoading(null)
  }

  const testAstriaWebhookCorrect = async () => {
    setLoading("correct")
    try {
      // Use the server action to test with correct secret
      const response = await fetch("/api/debug/test-astria-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "39",
          testData: {
            id: "test-123",
            status: "completed",
            images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
          },
        }),
      })

      const data = await response.json()
      setAstriaCorrectResult({ status: response.status, data })
    } catch (error) {
      setAstriaCorrectResult({ status: "error", data: { error: error.message } })
    }
    setLoading(null)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Webhook Test Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Simple Webhook Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testSimpleWebhook} disabled={loading === "simple"}>
            {loading === "simple" ? "Testing..." : "Test Simple Webhook"}
          </Button>

          {simpleResult && (
            <div className="p-4 bg-gray-100 rounded">
              <p>
                <strong>Status:</strong> {simpleResult.status}
              </p>
              <p>
                <strong>Response:</strong> {JSON.stringify(simpleResult.data)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Astria Webhook Test (Wrong Secret)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAstriaWebhookWrong} disabled={loading === "wrong"}>
            {loading === "wrong" ? "Testing..." : "Test Astria Webhook (Wrong Secret)"}
          </Button>

          {astriaResult && (
            <div className="p-4 bg-gray-100 rounded">
              <p>
                <strong>Status:</strong> {astriaResult.status}
              </p>
              <p>
                <strong>Response:</strong> {JSON.stringify(astriaResult.data)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Astria Webhook Test (Correct Secret)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAstriaWebhookCorrect} disabled={loading === "correct"}>
            {loading === "correct" ? "Testing..." : "Test Astria Webhook (Correct Secret)"}
          </Button>

          {astriaCorrectResult && (
            <div className="p-4 bg-gray-100 rounded">
              <p>
                <strong>Status:</strong> {astriaCorrectResult.status}
              </p>
              <p>
                <strong>Response:</strong> {JSON.stringify(astriaCorrectResult.data)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
            <p>
              <strong>Note:</strong> Webhook secret is handled server-side for security
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
