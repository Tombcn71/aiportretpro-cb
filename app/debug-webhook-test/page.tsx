"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebhookTestPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<string | null>(null)

  const testSimpleWebhook = async () => {
    setLoading("simple")
    try {
      const response = await fetch("/api/debug/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "simple webhook test" }),
      })

      const data = await response.text()
      setResults((prev) => ({
        ...prev,
        simple: {
          status: response.status,
          response: data,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        simple: {
          status: "Error",
          response: error.message,
        },
      }))
    }
    setLoading(null)
  }

  const testAstriaWebhook = async () => {
    setLoading("astria")
    try {
      // Test with the actual webhook secret from environment
      const response = await fetch("/api/astria/prompt-webhook?user_id=1&model_id=39&webhook_secret=test_secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "test_prompt_123",
          status: "finished",
          images: ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
        }),
      })

      const data = await response.text()
      setResults((prev) => ({
        ...prev,
        astria: {
          status: response.status,
          response: data,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        astria: {
          status: "Error",
          response: error.message,
        },
      }))
    }
    setLoading(null)
  }

  const testAstriaWebhookWithCorrectSecret = async () => {
    setLoading("astria_correct")
    try {
      // Test with the correct webhook secret
      const response = await fetch(
        "/api/astria/prompt-webhook?user_id=1&model_id=39&webhook_secret=shadf892yr32548hq23h",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: "test_prompt_123",
            status: "finished",
            images: ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
          }),
        },
      )

      const data = await response.text()
      setResults((prev) => ({
        ...prev,
        astria_correct: {
          status: response.status,
          response: data,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        astria_correct: {
          status: "Error",
          response: error.message,
        },
      }))
    }
    setLoading(null)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Webhook Test Dashboard</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Simple Webhook Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testSimpleWebhook} disabled={loading === "simple"} className="mb-4">
              {loading === "simple" ? "Testing..." : "Test Simple Webhook"}
            </Button>

            {results.simple && (
              <div className="bg-gray-100 p-4 rounded">
                <p>
                  <strong>Status:</strong> {results.simple.status}
                </p>
                <p>
                  <strong>Response:</strong> {results.simple.response}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Astria Webhook Test (Wrong Secret)</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testAstriaWebhook} disabled={loading === "astria"} className="mb-4">
              {loading === "astria" ? "Testing..." : "Test Astria Webhook"}
            </Button>

            {results.astria && (
              <div className="bg-gray-100 p-4 rounded">
                <p>
                  <strong>Status:</strong> {results.astria.status}
                </p>
                <p>
                  <strong>Response:</strong> {results.astria.response}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Astria Webhook Test (Correct Secret)</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={testAstriaWebhookWithCorrectSecret}
              disabled={loading === "astria_correct"}
              className="mb-4"
            >
              {loading === "astria_correct" ? "Testing..." : "Test Astria Webhook (Correct Secret)"}
            </Button>

            {results.astria_correct && (
              <div className="bg-gray-100 p-4 rounded">
                <p>
                  <strong>Status:</strong> {results.astria_correct.status}
                </p>
                <p>
                  <strong>Response:</strong> {results.astria_correct.response}
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
            <div className="bg-gray-100 p-4 rounded">
              <p>
                <strong>Expected Webhook Secret:</strong> shadf892yr32548hq23h
              </p>
              <p>
                <strong>Test URL:</strong> /api/astria/prompt-webhook
              </p>
              <p>
                <strong>Simple Test URL:</strong> /api/debug/test-webhook
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
