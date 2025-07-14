"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

interface DebugData {
  timestamp: string
  astria_connection: any
  environment: any
  webhook_logs: any[]
  project_info: any
  recent_projects: any[]
  webhook_url: string
}

export default function DebugAstriaPage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [projectId, setProjectId] = useState("")

  const fetchDebugData = async (pid?: string) => {
    setLoading(true)
    try {
      const url = pid ? `/api/debug/astria-flow?projectId=${pid}` : "/api/debug/astria-flow"
      const response = await fetch(url)
      const data = await response.json()
      setDebugData(data)
    } catch (error) {
      console.error("Failed to fetch debug data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      received: "bg-blue-100 text-blue-800",
      parsed: "bg-green-100 text-green-800",
      processed_success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      error: "bg-red-100 text-red-800",
      completed_no_images: "bg-yellow-100 text-yellow-800",
    }
    return <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Astria Debug Dashboard</h1>
          <Button onClick={() => fetchDebugData(projectId)} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Project ID Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Debug Specific Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Project ID (e.g., 39)"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button onClick={() => fetchDebugData(projectId)}>Check Project</Button>
            </div>
          </CardContent>
        </Card>

        {debugData && (
          <div className="grid gap-6">
            {/* Environment Check */}
            <Card>
              <CardHeader>
                <CardTitle>Environment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(debugData.environment).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">{key}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm font-mono">Webhook URL: {debugData.webhook_url}</p>
                </div>
              </CardContent>
            </Card>

            {/* Astria Connection */}
            <Card>
              <CardHeader>
                <CardTitle>Astria API Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  {debugData.astria_connection.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>{debugData.astria_connection.success ? "Connected" : "Failed"}</span>
                </div>
                {!debugData.astria_connection.success && (
                  <div className="p-3 bg-red-50 rounded-md">
                    <p className="text-sm text-red-700">Error: {JSON.stringify(debugData.astria_connection.error)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Info */}
            {debugData.project_info && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Details (ID: {debugData.project_info.id})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Name:</strong> {debugData.project_info.name}
                      </p>
                      <p>
                        <strong>Status:</strong> {debugData.project_info.status}
                      </p>
                      <p>
                        <strong>Gender:</strong> {debugData.project_info.gender}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Created:</strong> {new Date(debugData.project_info.created_at).toLocaleString()}
                      </p>
                      <p>
                        <strong>Photos:</strong> {debugData.project_info.generated_photos?.length || 0}
                      </p>
                      <p>
                        <strong>Prediction ID:</strong> {debugData.project_info.prediction_id || "None"}
                      </p>
                    </div>
                  </div>
                  {debugData.project_info.generated_photos?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Generated Photos:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {debugData.project_info.generated_photos.slice(0, 8).map((photo: string, index: number) => (
                          <img
                            key={index}
                            src={photo || "/placeholder.svg"}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {debugData.recent_projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(project.status)}
                        <div>
                          <p className="font-medium">
                            #{project.id} - {project.name}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(project.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{project.photo_count} photos</p>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Webhook Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Webhook Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {debugData.webhook_logs.length === 0 ? (
                    <p className="text-gray-500">No webhook logs found. This might be the issue!</p>
                  ) : (
                    debugData.webhook_logs.map((log) => (
                      <div key={log.id} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Project #{log.project_id}</span>
                            {getStatusBadge(log.status)}
                          </div>
                          <span className="text-sm text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
                        </div>

                        {log.error_message && (
                          <div className="mb-2 p-2 bg-red-50 rounded text-sm text-red-700">
                            Error: {log.error_message}
                          </div>
                        )}

                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600">Raw Body</summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-xs">{log.raw_body}</pre>
                        </details>

                        {log.parsed_data && (
                          <details className="text-sm mt-2">
                            <summary className="cursor-pointer text-blue-600">Parsed Data</summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                              {JSON.stringify(log.parsed_data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
