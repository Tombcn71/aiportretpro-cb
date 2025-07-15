"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Webhook, AlertTriangle } from "lucide-react"

interface WebhookLog {
  id: number
  created_at: string
  payload: any
  error?: string
}

interface Project {
  id: number
  name: string
  tune_id: string
  status: string
  has_photos: boolean
  photo_count: number
  created_at: string
}

export default function DebugAstriaResponsesPage() {
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/debug/astria-responses")
      if (response.ok) {
        const data = await response.json()
        setWebhookLogs(data.webhookLogs || [])
        setProjects(data.projects || [])
      } else {
        setError("Failed to fetch data")
      }
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

      if (result.success) {
        alert(`✅ Success! Added ${result.newImages} new photos. Total: ${result.totalPhotos}`)
        fetchData() // Refresh data
      } else {
        alert(`❌ Failed: ${result.error}`)
      }
    } catch (err) {
      alert(`❌ Error: ${err}`)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Astria Response Debug
          </h1>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Projects Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Projects with Tune IDs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        #{project.id}: {project.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Tune ID: <code className="bg-gray-100 px-1 rounded">{project.tune_id}</code>
                      </p>
                      <p className="text-xs text-gray-500">Created: {new Date(project.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant={project.has_photos ? "default" : "destructive"}>
                          {project.has_photos ? `${project.photo_count} photos` : "No photos"}
                        </Badge>
                        <br />
                        <Badge variant="outline" className="mt-1">
                          {project.status}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => manualFetch(project.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        🔄 Fetch Photos
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Webhook Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Recent Webhook Calls from Astria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {webhookLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>No webhook calls received yet</p>
                <p className="text-sm">This might be why photos aren't coming through</p>
              </div>
            ) : (
              <div className="space-y-4">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{new Date(log.created_at).toLocaleString()}</span>
                      {log.error && <Badge variant="destructive">Error</Badge>}
                    </div>

                    {log.error && <p className="text-red-600 text-sm mb-2">Error: {log.error}</p>}

                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
                        View Astria Response
                      </summary>
                      <pre className="p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
