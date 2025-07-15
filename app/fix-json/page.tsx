"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FixJsonPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fixJson = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/database/fix-json", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Fix Database JSON</h1>

        <Card>
          <CardHeader>
            <CardTitle>Repair Malformed JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This will convert malformed JSON strings in the generated_photos column to proper PostgreSQL arrays.
            </p>
            <Button onClick={fixJson} disabled={loading}>
              {loading ? "Fixing..." : "🔧 Fix Database JSON"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Fix Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
