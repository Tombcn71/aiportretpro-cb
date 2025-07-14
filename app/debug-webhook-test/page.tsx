"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebhookTestPage() {
  const [simpleResult, setSimpleResult] = useState<any>(null)
  const [astriaResult, setAstriaResult] = useState<any>(null)
  const [astriaCorrectResult, setAstriaCorrectResult] = useState<any>(null)

  const testSimpleWebhook = async () => {
    try {
      const response = await fetch("/api/debug/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "simple webhook test" }),
      })

      const data = await response.json()
      setSimpleResult({
        status: response.status,
        data,
      })
    } catch (error) {
      setSimpleResult({
        status: "Error",
        data: { error: error.message },
      })
    }
  }

  const testAstriaWebhook = async () => {
    try {
      const response = await fetch("/api/astria/prompt-webhook?user_id=1&model_id=39&webhook_secret=wrong_secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "test-prompt-123",
          status: "finished",
          images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        }),
      })

      const data = await response.json()
      setAstriaResult({
        status: response.status,
        data,
      })
    } catch (error) {
      setAstriaResult({
        status: "Error",
        data: { error: error.message },
      })
    }
  }

  const testAstriaWebhookCorrect = async () => {
    try {
      const response = await fetch(
        "/api/astria/prompt-webhook?user_id=1&model_id=39&webhook_secret=shadf892yr32548hq23h",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: "test-prompt-123",
            status: "finished",
            images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
          }),
        },
      )

      const data = await response.json()
      setAstriaCorrectResult({
        status: response.status,
        data,
      })
    } catch (error) {
      setAstriaCorrectResult({
        status: "Error",
        data: { error: error.message },
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Webhook Test Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Simple Webhook Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testSimpleWebhook}>Test Simple Webhook</Button>
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
            <Button onClick={testAstriaWebhook}>Test Astria Webhook</Button>
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
            <Button onClick={testAstriaWebhookCorrect}>Test Astria Webhook (Correct Secret)</Button>
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
            <p>
              <strong>Expected Webhook Secret:</strong> shadf892yr32548hq23h
            </p>
            <p>
              <strong>Test URL:</strong> /api/astria/prompt-webhook
            </p>
            <p>
              <strong>Simple Test URL:</strong> /api/debug/test-webhook
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
