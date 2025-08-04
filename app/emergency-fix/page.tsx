"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EmergencyFixPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testProjectCreation = async () => {
    setLoading(true)
    try {
      const testData = {
        projectName: "Emergency Test",
        gender: "man",
        selectedPackId: "clx1qf5621msf356hjc7fq3w",
        uploadedPhotos: [
          "https://mp.astria.ai/test1.jpg",
          "https://mp.astria.ai/test2.jpg",
          "https://mp.astria.ai/test3.jpg",
          "https://mp.astria.ai/test4.jpg",
        ],
      }

      const response = await fetch("/api/projects/create-with-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      })

      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">🚨 Emergency Fix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Status:</h3>
            <p className="text-red-700">Code is nu terugzet naar werkende versie</p>
          </div>

          <Button onClick={testProjectCreation} disabled={loading} className="w-full">
            {loading ? "Testing..." : "🧪 Test Project Creation"}
          </Button>

          {result && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Test Result
                  <Badge variant={result.status === 200 ? "default" : "destructive"}>{result.status || "Error"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
              </CardContent>
            </Card>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
              <li>Test hierboven moet SUCCESS geven</li>
              <li>Ga naar /select-pack en probeer een echte fotoshoot</li>
              <li>Check /dashboard voor resultaten</li>
              <li>Als het nog steeds niet werkt, laat me de exacte error zien</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
