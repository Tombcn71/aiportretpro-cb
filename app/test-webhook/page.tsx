"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw, Database, Webhook } from "lucide-react"

export default function TestWebhookPage() {
  const [manualFetchResult, setManualFetchResult] = useState<any>(null)
  const [webhookTestResult, setWebhookTestResult] = useState<any>(null)
  const [dbFixResult, setDbFixResult] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const testManualFetch = async () => {
    setLoading("manual-fetch")
    try {
      const response = await fetch("/api/astria/manual-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: 42 }),
      })
      const data = await response.json()
      setManualFetchResult(data)
    } catch (error) {
      setManualFetchResult({ error: "Failed to test manual fetch" })
    } finally {
      setLoading(null)
    }
  }

  const testWebhookSimulation = async () => {
    setLoading("webhook-test")
    try {
      // Simulate a webhook call with test data
      const testWebhookData = {
        prompt: {
          id: 12345,
          tune_id: 2955915,
          status: "succeeded",
          images: ["https://mp.astria.ai/test1.jpg", "https://mp.astria.ai/test2.jpg"],
          tunes: [
            {
              id: 2955915,
              title: "toms test fotoshoot",
              model_type: "lora",
              name: "man",
            },
          ],
        },
      }

      const response = await fetch(
        "/api/astria/prompt-webhook?user_id=1&model_id=2955915&webhook_secret=shadf892yr32548hq23h",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testWebhookData),
        },
      )
      const data = await response.json()
      setWebhookTestResult(data)
    } catch (error) {
      setWebhookTestResult({ error: "Failed to test webhook" })
    } finally {
      setLoading(null)
    }
  }

  const fixDatabase = async () => {
    setLoading("db-fix")
    try {
      const response = await fetch("/api/database/fix-json", {
        method: "POST",
      })
      const data = await response.json()
      setDbFixResult(data)
    } catch (error) {
      setDbFixResult({ error: "Failed to fix database" })
    } finally {
      setLoading(null)
    }
  }

  const ResultCard = ({ title, result, icon }: { title: string; result: any; icon: React.ReactNode }) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-2">
            {result.success ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Success
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            )}
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-48">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">No result yet</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Test Webhook & Database</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={fixDatabase}
              disabled={loading === "db-fix"}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center bg-transparent"
            >
              {loading === "db-fix" ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Database className="h-6 w-6" />}
              <span className="mt-2">Fix Database JSON</span>
            </Button>

            <Button
              onClick={testManualFetch}
              disabled={loading === "manual-fetch"}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center bg-transparent"
            >
              {loading === "manual-fetch" ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <RefreshCw className="h-6 w-6" />
              )}
              <span className="mt-2">Test Manual Fetch</span>
            </Button>

            <Button
              onClick={testWebhookSimulation}
              disabled={loading === "webhook-test"}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center bg-transparent"
            >
              {loading === "webhook-test" ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <Webhook className="h-6 w-6" />
              )}
              <span className="mt-2">Test Webhook</span>
            </Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Test Order:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>First: Fix Database JSON (if needed)</li>
              <li>Second: Test Manual Fetch (should find 40 photos)</li>
              <li>Third: Test Webhook Simulation</li>
              <li>Finally: Check dashboard for photos</li>
            </ol>
          </div>

          <ResultCard title="Database Fix Result" result={dbFixResult} icon={<Database className="h-5 w-5" />} />
          <ResultCard title="Manual Fetch Result" result={manualFetchResult} icon={<RefreshCw className="h-5 w-5" />} />
          <ResultCard title="Webhook Test Result" result={webhookTestResult} icon={<Webhook className="h-5 w-5" />} />
        </CardContent>
      </Card>
    </div>
  )
}
