"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, RefreshCw, Database, Webhook } from "lucide-react"

interface WebhookLog {
  id: number
  type: string
  created_at: string
  payload: any
  error?: string
}

interface Project {
  id: number
  name: string
  tune_id: string
  status: string
  created_at: string
  photo_status?: string
  generated_photos?: string
}

interface DebugData {
  webhookLogs: WebhookLog[]
  projectsWithoutPhotos: Project[]
  recentProjects: Project[]
  summary: {
    totalWebhookLogs: number
    projectsWithoutPhotos: number
    recentProjectsCount: number
  }
}

export default function EmergencyWebhookDebugPage() {
  const [data, setData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/debug/webhook-emergency")
      if (!response.ok) throw new Error("Failed to fetch debug data")
      const result = await response.json()
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Error Loading Debug Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchData} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />🚨 Emergency Webhook Debug
          </h1>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                Webhook Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.summary.totalWebhookLogs || 0}</div>
              <p className="text-xs text-muted-foreground">Recent webhook calls</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Missing Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{data?.summary.projectsWithoutPhotos || 0}</div>
              <p className="text-xs text-muted-foreground">Projects with tune_id but no photos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.summary.recentProjectsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total recent projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Without Photos - CRITICAL */}
        {data?.projectsWithoutPhotos && data.projectsWithoutPhotos.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />🚨 CRITICAL: Projects Missing Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.projectsWithoutPhotos.map((project) => (
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
                      <div className="text-right">
                        <Badge variant="destructive">{project.status}</Badge>
                        <p className="text-xs text-red-600 mt-1">No photos received</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Webhook Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Recent Webhook Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data?.webhookLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 border rounded-lg ${log.error ? "bg-red-50 border-red-200" : "bg-gray-50"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={log.error ? "destructive" : "secondary"}>{log.type}</Badge>
                    <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  {log.error && <p className="text-sm text-red-600 mb-2">Error: {log.error}</p>}
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

        {/* All Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              All Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data?.recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">
                      #{project.id}: {project.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">Tune: {project.tune_id || "None"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.photo_status === "has_data" ? "default" : "destructive"}>
                      {project.photo_status}
                    </Badge>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
