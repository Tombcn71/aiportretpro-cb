"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/webhook-logs")
      const data = await response.json()
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

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Astria Webhook Logs</CardTitle>
          <Button onClick={fetchLogs} disabled={loading}>
            Refresh Logs
          </Button>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p>No webhook logs found</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index} className="border p-4 rounded">
                  <div className="text-sm text-gray-500 mb-2">
                    {log.type} - {new Date(log.created_at).toLocaleString()}
                  </div>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
