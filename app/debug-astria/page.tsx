"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function DebugAstriaPage() {
  const [data, setData] = useState<any>(null)
  const [projectId, setProjectId] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchData = async (specificProjectId?: string) => {
    setLoading(true)
    try {
      const url = specificProjectId ? `/api/debug/astria-flow?projectId=${specificProjectId}` : "/api/debug/astria-flow"

      const response = await fetch(url)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching debug data:", error)
      setData({ error: error.message })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleProjectSearch = () => {
    if (projectId.trim()) {
      fetchData(projectId.trim())
    } else {
      fetchData()
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Debug Astria Flow</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Debug Astria Flow</h1>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Astria Flow</h1>

      <Card>
        <CardHeader>
          <CardTitle>Search Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Enter project ID (e.g., 39)"
            />
            <Button onClick={handleProjectSearch}>Search</Button>
            <Button
              onClick={() => {
                setProjectId("")
                fetchData()
              }}
              variant="outline"
            >
              Show All
            </Button>
          </div>
        </CardContent>
      </Card>

      {data.error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.error}</p>
            {data.details && <p className="text-sm text-gray-600 mt-2">{data.details}</p>}
          </CardContent>
        </Card>
      )}

      {data.envInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Webhook Secret:</strong>{" "}
                {data.envInfo.hasWebhookSecret
                  ? `✅ Present (${data.envInfo.webhookSecretLength} chars)`
                  : "❌ Missing"}
              </p>
              <p>
                <strong>NextAuth URL:</strong>{" "}
                {data.envInfo.hasNextAuthUrl ? `✅ ${data.envInfo.nextAuthUrl}` : "❌ Missing"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.projectDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {data.projectDetails.id}
              </p>
              <p>
                <strong>Name:</strong> {data.projectDetails.name}
              </p>
              <p>
                <strong>Status:</strong> {data.projectDetails.status}
              </p>
              <p>
                <strong>Model ID:</strong> {data.projectDetails.model_id}
              </p>
              <p>
                <strong>Generated Photos:</strong> {data.projectDetails.generated_photos?.length || 0}
              </p>
              <p>
                <strong>Created:</strong> {new Date(data.projectDetails.created_at).toLocaleString()}
              </p>
            </div>

            {data.projectDetails.generated_photos && data.projectDetails.generated_photos.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Sample Photos:</p>
                <div className="grid grid-cols-3 gap-2">
                  {data.projectDetails.generated_photos.slice(0, 6).map((photo: string, index: number) => (
                    <img
                      key={index}
                      src={photo || "/placeholder.svg"}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=128&width=128&text=Error"
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {data.webhookLogs && data.webhookLogs.length > 0 ? (
            <div className="space-y-4">
              {data.webhookLogs.map((log: any) => (
                <div key={log.id} className="border p-4 rounded">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong>Project ID:</strong> {log.project_id}
                    </p>
                    <p>
                      <strong>Type:</strong> {log.webhook_type}
                    </p>
                    <p>
                      <strong>Method:</strong> {log.method || "N/A"}
                    </p>
                    <p>
                      <strong>Processed:</strong> {log.processed ? "✅ Yes" : "❌ No"}
                    </p>
                    <p>
                      <strong>Created:</strong> {new Date(log.created_at).toLocaleString()}
                    </p>
                    {log.error_message && (
                      <p className="col-span-2">
                        <strong>Error:</strong> <span className="text-red-600">{log.error_message}</span>
                      </p>
                    )}
                  </div>
                  {log.body && (
                    <div className="mt-2">
                      <strong>Body:</strong>
                      <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-auto">
                        {JSON.stringify(log.body, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-red-600 text-lg font-semibold">No webhook logs found. This might be the issue!</p>
              <p className="text-gray-600 mt-2">
                This means Astria is not sending webhooks to your endpoint, or the webhook handler is not logging them.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {data.recentProjects && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recentProjects.map((project: any) => (
                <div key={project.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      #{project.id} - {project.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          project.status === "completed"
                            ? "text-green-600"
                            : project.status === "processing"
                              ? "text-blue-600"
                              : project.status === "failed"
                                ? "text-red-600"
                                : "text-gray-600"
                        }`}
                      >
                        {project.status}
                      </span>{" "}
                      | Photos: {project.photo_count} | Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setProjectId(project.id.toString())
                      fetchData(project.id.toString())
                    }}
                  >
                    Debug This Project
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button onClick={() => fetchData()} className="mr-2">
              Refresh Data
            </Button>
            <Button onClick={() => window.open("/debug-webhook-test", "_blank")} variant="outline">
              Test Webhooks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
