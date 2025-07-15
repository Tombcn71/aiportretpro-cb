"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Webhook, AlertTriangle } from "lucide-react"

interface WebhookLog {
  id: number
  project_id: number
  type: string
  method: string
  processed: boolean
  created_at: string
  body: any
  error?: string
}

interface Project {
  id: number
  name: string
  status: string
  photo_count: number
  created_at: string
  tune_id?: string
}

export default function DebugAstriaPage() {
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [webhookSecret, setWebhookSecret] = useState<string>("")
  const [nextAuthUrl, setNextAuthUrl] = useState<string>("")

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/debug/astria-flow")
      if (response.ok) {
        const data = await response.json()
        setWebhookLogs(data.webhookLogs || [])
        setProjects(data.projects || [])
        setWebhookSecret(data.webhookSecret || "")
        setNextAuthUrl(data.nextAuthUrl || "")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const debugProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/debug/check-project/${projectId}`)
      const result = await response.json()

      if (result.success) {
        alert(`Project Debug:\n${JSON.stringify(result, null, 2)}`)
      } else {
        alert(`Debug failed: ${result.error}`)
      }
    } catch (err) {
      alert(`Error: ${err}`)
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
        alert(
          `✅ Success! Added ${result.newImages || result.imagesCount} new photos. Total: ${result.totalPhotos || result.totalImages}`,
        )
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
            Debug Astria Flow
          </h1>
          <div className="flex gap-2">
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Show All
            </Button>
          </div>
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

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Webhook Secret:</span>
                {webhookSecret ? (
                  <Badge variant="default">✅ Present ({webhookSecret.length} chars)</Badge>
                ) : (
                  <Badge variant="destructive">❌ Missing</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">NextAuth URL:</span>
                <span className="text-sm text-gray-600">{nextAuthUrl || "Not set"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Webhook Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Recent Webhook Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {webhookLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>No webhook logs found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Project ID: {log.project_id}</span>
                        <Badge variant="outline">Type: {log.type}</Badge>
                        <Badge variant="outline">Method: {log.method}</Badge>
                        <Badge variant={log.processed ? "default" : "destructive"}>
                          Processed: {log.processed ? "✅ Yes" : "❌ No"}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(log.created_at).toLocaleString("nl-NL")}</span>
                    </div>

                    {log.error && (
                      <div className="mb-2">
                        <Badge variant="destructive">Error: {log.error}</Badge>
                      </div>
                    )}

                    {log.body && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">Body:</summary>
                        <pre className="p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.body, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        #{project.id} - {project.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">Status: {project.status}</Badge>
                        <Badge variant={project.photo_count > 0 ? "default" : "destructive"}>
                          Photos: {project.photo_count}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Created: {new Date(project.created_at).toLocaleString("nl-NL")}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => debugProject(project.id)}>
                        Debug This Project
                      </Button>
                      {project.tune_id && (
                        <Button size="sm" onClick={() => manualFetch(project.id)}>
                          🔄 Fetch Photos
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Webhooks */}
        <Card>
          <CardHeader>
            <CardTitle>Test Webhooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  fetch("/api/debug/test-webhook", { method: "POST" })
                    .then(() => {
                      alert("Test webhook sent!")
                      fetchData()
                    })
                    .catch((err) => alert(`Error: ${err}`))
                }}
              >
                Test Simple Webhook
              </Button>
              <Button
                onClick={() => {
                  fetch("/api/debug/test-astria-webhook", { method: "POST" })
                    .then(() => {
                      alert("Test Astria webhook sent!")
                      fetchData()
                    })
                    .catch((err) => alert(`Error: ${err}`))
                }}
              >
                Test Astria Webhook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
