"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Debug422Page() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRequest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/astria/debug-422", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: "Test Project",
          gender: "man",
          selectedPackId: "928",
          uploadedPhotos: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
          ],
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setResult({ error: "Failed to test request" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug 422 Error</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Pack Request (No Money Spent)</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testRequest} disabled={loading} className="mb-4">
              {loading ? "Testing..." : "Test Request to Pack 928"}
            </Button>
            <p className="text-sm text-gray-600">
              This will test the exact same request but show us the validation error details without spending money.
            </p>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
