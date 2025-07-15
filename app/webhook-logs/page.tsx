"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/webhook-logs")
      const data = await response.json()
      console.log("Fetched logs:", data)
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const analyzeImageLocations = (payload: any) => {
    const locations = []

    if (payload.images) locations.push({ path: "payload.images", data: payload.images })
    if (payload.prompt?.images) locations.push({ path: "payload.prompt.images", data: payload.prompt.images })
    if (payload.prompt?.image_urls)
      locations.push({ path: "payload.prompt.image_urls", data: payload.prompt.image_urls })
    if (payload.image_urls) locations.push({ path: "payload.image_urls", data: payload.image_urls })
    if (payload.outputs) locations.push({ path: "payload.outputs", data: payload.outputs })
    if (payload.results) locations.push({ path: "payload.results", data: payload.results })

    return locations
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Astria Webhook Logs ({logs.length} logs)</CardTitle>
          <Button onClick={fetchLogs} disabled={loading}>
            {loading ? "Loading..." : "Refresh Logs"}
          </Button>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p>No webhook logs found</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => {
                const imageLocations = analyzeImageLocations(log.payload || {})

                return (
                  <div key={index} className="border p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-500">
                        <strong>{log.type}</strong> - {new Date(log.created_at).toLocaleString()}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                      >
                        {selectedLog?.id === log.id ? "Hide" : "Show"} Details
                      </Button>
                    </div>

                    {/* Show image analysis */}
                    {imageLocations.length > 0 && (
                      <div className="mb-2 p-2 bg-green-50 rounded">
                        <strong>🖼️ Images found:</strong>
                        {imageLocations.map((loc, i) => (
                          <div key={i} className="text-sm">
                            <code>{loc.path}</code>:{" "}
                            {Array.isArray(loc.data) ? `${loc.data.length} items` : typeof loc.data}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Show payload keys */}
                    <div className="mb-2 text-sm">
                      <strong>Keys:</strong> {Object.keys(log.payload || {}).join(", ")}
                    </div>

                    {selectedLog?.id === log.id && (
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
