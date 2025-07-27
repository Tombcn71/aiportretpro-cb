"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugProjectsSchemaPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkSchema = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/check-projects-schema")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setResult({ error: "Failed to check schema" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Projects Schema</h1>

      <Button onClick={checkSchema} disabled={loading} className="mb-6">
        {loading ? "Checking..." : "Check Projects Schema"}
      </Button>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schema Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result.schema, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {result.sample && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Record</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(result.sample, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {result.error && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{result.error}</p>
                {result.details && <pre className="bg-red-50 p-4 rounded text-sm mt-2">{result.details}</pre>}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
