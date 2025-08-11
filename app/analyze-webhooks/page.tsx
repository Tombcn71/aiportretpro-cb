"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyzeWebhooksPage() {
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/check-old-webhooks")
      const data = await response.json()
      setAnalysis(data)
      console.log("Webhook analysis:", data)
    } catch (error) {
      console.error("Error fetching analysis:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  if (loading) return <div>Loading webhook analysis...</div>
  if (!analysis) return <div>No analysis data</div>

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Analysis</CardTitle>
          <Button onClick={fetchAnalysis} disabled={loading}>
            Refresh Analysis
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Total Logs:</strong> {analysis.totalLogs}
            </div>
            <div>
              <strong>Logs with Images:</strong> {analysis.logsWithImages}
            </div>
          </div>
        </CardContent>
      </Card>

      {analysis.analysis && analysis.analysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Image Locations Found</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.analysis
              .filter((item: any) => item.hasImages)
              .map((item: any, index: number) => (
                <div key={index} className="border p-4 rounded mb-4">
                  <div className="text-sm text-gray-500 mb-2">
                    {item.type} - {new Date(item.created_at).toLocaleString()}
                  </div>
                  <div className="space-y-2">
                    {item.imageLocations.map((loc: any, i: number) => (
                      <div key={i} className="bg-green-50 p-2 rounded">
                        <div>
                          <strong>Path:</strong> <code>{loc.path}</code>
                        </div>
                        <div>
                          <strong>Type:</strong> {loc.type}
                        </div>
                        {loc.length && (
                          <div>
                            <strong>Length:</strong> {loc.length}
                          </div>
                        )}
                        <div>
                          <strong>Sample:</strong> <code>{JSON.stringify(loc.sample)}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs">
                    <strong>All Keys:</strong> {item.allKeys.join(", ")}
                  </div>
                  {item.promptKeys.length > 0 && (
                    <div className="text-xs">
                      <strong>Prompt Keys:</strong> {item.promptKeys.join(", ")}
                    </div>
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {analysis.samplePayload && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Payload</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(analysis.samplePayload, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
