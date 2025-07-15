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
        <h1 className="text-3xl font-bold mb-8">Test Webhook & Fix Database</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Fix Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Fix malformed JSON strings and convert to PostgreSQL arrays</p>
              <Button onClick={fixDatabase} disabled={loading} className="w-full">
                {loading ? "Fixing..." : "🔧 Fix Database JSON"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Test Manual Fetch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Test manual fetch for project #42</p>
              <Button onClick={testManualFetch} disabled={loading} className="w-full">
                {loading ? "Testing..." : "🔄 Test Manual Fetch"}
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
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>First click "Fix Database JSON" to repair malformed data</li>
                <li>Then click "Test Manual Fetch" to test the functionality</li>
                <li>Go to /dashboard to see if photos appear</li>
                <li>If everything works, the webhook should work too</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
