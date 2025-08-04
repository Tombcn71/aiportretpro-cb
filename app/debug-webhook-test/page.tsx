"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, RefreshCw, Database, Webhook, CheckCircle, XCircle } from "lucide-react"

interface WebhookLog {
  id: number
  type: string
  payload: any
  error?: string
  created_at: string
}

interface Project {
  id: number
  name: string
  tune_id: string
  status: string
  created_at: string
  generated_photos?: string
}

export default function DebugWebhookTestPage() {
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch webhook logs
      const webhookResponse = await fetch("/api/debug/webhook-logs")
      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json()
        setWebhookLogs(webhookData.logs || [])
      }

      // Fetch projects
      const projectsResponse = await fetch("/api/debug/projects")
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const testWebhook = async () => {
    try {
      const response = await fetch("/api/debug/test-webhook", { method: "POST" })
      const result = await response.json()
      alert(result.success ? "Webhook test successful!" : `Webhook test failed: ${result.error}`)
      fetchData() // Refresh data
    } catch (err) {
      alert(`Webhook test error: ${err}`)
    }
  }

  const rescuePhotos = async (projectId: number) => {
    try {
      const response = await fetch("/api/astria/manual-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      })
      const result = await response.json()
      alert(result.success ? `Rescued ${result.imagesCount} photos!` : `Rescue failed: ${result.error}`)
      fetchData() // Refresh data
    } catch (err) {
      alert(`Rescue error: ${err}`)
    }
  }

  const fixTuneId = async (projectId: number) => {
    try {
      const response = await fetch("/api/debug/fix-tune-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      })
      const result = await response.json()
      alert(result.success ? `Fixed tune_id for project ${projectId}!` : `Fix failed: ${result.error}`)
      fetchData() // Refresh data
    } catch (err) {
      alert(`Fix error: ${err}`)
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

  const projectsWithoutPhotos = projects.filter(
    (p) => p.tune_id && (!p.generated_photos || p.generated_photos === "[]" || p.generated_photos === ""),
  )

  const projectsWithoutTuneId = projects.filter((p) => !p.tune_id && p.status !== "draft")

  const recentWebhookErrors = webhookLogs.filter((log) => log.error).slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Webhook className="h-8 w-8" />
            Webhook Debug Dashboard
          </h1>
          <div className="flex gap-2">
            <Button onClick={testWebhook} variant="outline">
              Test Webhook
            </Button>
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">No Tune ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{projectsWithoutTuneId.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Missing Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{projectsWithoutPhotos.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Webhook Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webhookLogs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{recentWebhookErrors.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Without Tune ID - ROOT CAUSE */}
        {projectsWithoutTuneId.length > 0 && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />🔧 Projects Without Tune ID (Root Cause!)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                These projects don't have a tune_id, which means the Astria training didn't complete properly or the
                tune_id wasn't saved.
              </p>
              <div className="space-y-3">
                {projectsWithoutTuneId.slice(0, 10).map((project) => (
                  <div key={project.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Project #{project.id}: {project.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Status: <Badge variant="outline">{project.status}</Badge>
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(project.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => fixTuneId(project.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          🔧 Fix Tune ID
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Missing Photos - CRITICAL */}
        {projectsWithoutPhotos.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />🚨 Projects Missing Photos (Have Tune ID)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectsWithoutPhotos.map((project) => (
                  <div key={project.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Project #{project.id}: {project.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Tune ID: <code className="bg-gray-100 px-1 rounded">{project.tune_id}</code>
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(project.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{project.status}</Badge>
                        <Button
                          size="sm"
                          onClick={() => rescuePhotos(project.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          🚑 Rescue Photos
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Webhook Errors */}
        {recentWebhookErrors.length > 0 && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Webhook Errors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWebhookErrors.map((log) => (
                  <div key={log.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="destructive">{log.type}</Badge>
                      <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-red-600 mb-2">Error: {log.error}</p>
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800">View Payload</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Projects Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              All Projects Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {projects.map((project) => {
                const hasPhotos =
                  project.generated_photos && project.generated_photos !== "[]" && project.generated_photos !== ""
                const hasTuneId = !!project.tune_id

                return (
                  <div key={project.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">
                        #{project.id}: {project.name}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">Tune: {project.tune_id || "❌ None"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasTuneId ? (
                        <CheckCircle className="h-4 w-4 text-blue-500" title="Has Tune ID" />
                      ) : (
                        <XCircle className="h-4 w-4 text-orange-500" title="No Tune ID" />
                      )}
                      {hasPhotos ? (
                        <CheckCircle className="h-4 w-4 text-green-500" title="Has Photos" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" title="No Photos" />
                      )}
                      <Badge variant={hasPhotos ? "default" : "destructive"}>
                        {hasPhotos ? "Has Photos" : "No Photos"}
                      </Badge>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
