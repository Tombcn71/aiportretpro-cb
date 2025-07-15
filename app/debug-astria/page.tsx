"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: number
  name: string
  tune_id: string | null
  status: string
  photoCount: number
  created_at: string
  updated_at: string
}

interface WebhookLog {
  id: number
  type: string
  payload: any
  error: string | null
  created_at: string
}

interface DebugData {
  projects: Project[]
  webhookLogs: WebhookLog[]
  webhookSecret: string
  nextAuthUrl: string
}

export default function DebugAstriaPage() {
  const [data, setData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/debug/astria-flow")
      if (!response.ok) {
        throw new Error("Failed to fetch debug data")
      }
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const manualFetch = async (projectId: number) => {
    try {
      const response = await fetch("/api/astria/manual-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Success: ${result.message}\nImages added: ${result.imagesAdded}\nTotal images: ${result.totalImages}`)
        fetchData() // Refresh data
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div className="p-8">Loading debug data...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>
  if (!data) return <div className="p-8">No data available</div>

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Debug Astria Flow</h1>
        <div className="space-x-2">
          <Button onClick={fetchData} variant="outline">
            Show All
          </Button>
          <Button onClick={fetchData}>Refresh Data</Button>
        </div>
      </div>

      {/* Environment Check */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Webhook Secret:</strong> {data.webhookSecret}
          </div>
          <div>
            <strong>NextAuth URL:</strong> {data.nextAuthUrl}
          </div>
        </CardContent>
      </Card>

      {/* Recent Webhook Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {data.webhookLogs.length === 0 ? (
            <p className="text-gray-500">No webhook logs found</p>
          ) : (
            <div className="space-y-4">
              {data.webhookLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant={log.error ? "destructive" : "default"}>{log.type}</Badge>
                      <span className="ml-2 text-sm text-gray-600">{log.created_at}</span>
                    </div>
                    <Badge variant={log.error ? "destructive" : "secondary"}>
                      {log.error ? "❌ Error" : "✅ Success"}
                    </Badge>
                  </div>
                  {log.error && (
                    <div className="text-red-600 text-sm mb-2">
                      <strong>Error:</strong> {log.error}
                    </div>
                  )}
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600">Show payload</summary>
                    <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {data.projects.length === 0 ? (
            <p className="text-gray-500">No projects with tune_id found</p>
          ) : (
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        #{project.id} - {project.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          Status: <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <div>
                          Photos: <Badge variant="secondary">{project.photoCount}</Badge>
                        </div>
                        <div>
                          Tune ID: <code className="bg-gray-100 px-1 rounded">{project.tune_id}</code>
                        </div>
                        <div>Created: {project.created_at}</div>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(`/api/debug/check-project/${project.id}`, "_blank")}
                        variant="outline"
                      >
                        Debug This Project
                      </Button>
                      {project.tune_id && (
                        <Button size="sm" onClick={() => manualFetch(project.id)} variant="default">
                          🔄 Fetch Photos
                        </Button>
                      )}
                    </div>
                  </div>
                  {project.tune_id && (
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Webhook URL:</strong>
                      <br />
                      <code className="bg-gray-100 p-1 rounded break-all">
                        https://www.aiportretpro.nl/api/astria/prompt-webhook?user_id=1&model_id={project.tune_id}
                        &webhook_secret=shadf892yr32548hq23h
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Test Webhooks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Test URL:</strong> /api/astria/prompt-webhook
          </div>
          <div>
            <strong>Expected Format:</strong>
            <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
              {`{
  "prompt": {
    "id": 123,
    "tune_id": 2955915,
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "text": "prompt text",
    "status": "succeeded"
  }
}`}
            </pre>
          </div>
          <div className="text-sm text-gray-600">Note: Webhook secret is handled server-side for security.</div>
        </CardContent>
      </Card>
    </div>
  )
}
