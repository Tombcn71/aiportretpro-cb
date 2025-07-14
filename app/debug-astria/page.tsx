"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DebugAstriaPage() {
  const [debugData, setDebugData] = useState<any>(null)
  const [projectId, setProjectId] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchDebugData = async (specificProjectId?: string) => {
    setLoading(true)
    try {
      const url = specificProjectId ? `/api/debug/astria-flow?projectId=${specificProjectId}` : "/api/debug/astria-flow"

      const response = await fetch(url)
      const data = await response.json()
      setDebugData(data)
    } catch (error) {
      console.error("Failed to fetch debug data:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  const handleProjectSearch = () => {
    if (projectId) {
      fetchDebugData(projectId)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Astria Debug Dashboard</h1>

      <div className="grid gap-6">
        {/* Environment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {debugData?.environment ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <strong>Webhook Secret:</strong>
                  <span className={debugData.environment.webhookSecret === "Set" ? "text-green-600" : "text-red-600"}>
                    {" "}
                    {debugData.environment.webhookSecret}
                  </span>
                </div>
                <div>
                  <strong>NextAuth URL:</strong>
                  <span className={debugData.environment.nextAuthUrl === "Set" ? "text-green-600" : "text-red-600"}>
                    {" "}
                    {debugData.environment.nextAuthUrl}
                  </span>
                </div>
                <div>
                  <strong>Astria API Key:</strong>
                  <span className={debugData.environment.astriaApiKey === "Set" ? "text-green-600" : "text-red-600"}>
                    {" "}
                    {debugData.environment.astriaApiKey}
                  </span>
                </div>
              </div>
            ) : (
              <p>Loading environment data...</p>
            )}
          </CardContent>
        </Card>

        {/* Project Search */}
        <Card>
          <CardHeader>
            <CardTitle>Project Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="projectId">Project ID</Label>
                <Input
                  id="projectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="Enter project ID (e.g., 39)"
                />
              </div>
              <Button onClick={handleProjectSearch} disabled={loading}>
                {loading ? "Searching..." : "Search Project"}
              </Button>
              <Button onClick={() => fetchDebugData()} variant="outline">
                Refresh All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Specific Project Info */}
        {debugData?.projectInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Project Details (ID: {debugData.projectInfo.id})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Name:</strong> {debugData.projectInfo.name}
                </div>
                <div>
                  <strong>Status:</strong> {debugData.projectInfo.status}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(debugData.projectInfo.created_at).toLocaleString()}
                </div>
                <div>
                  <strong>Updated:</strong> {new Date(debugData.projectInfo.updated_at).toLocaleString()}
                </div>
                <div>
                  <strong>Generated Photos:</strong> {debugData.projectInfo.generated_photos?.length || 0}
                </div>
              </div>

              {debugData.projectInfo.generated_photos && debugData.projectInfo.generated_photos.length > 0 && (
                <div className="mt-4">
                  <strong>Sample Photos:</strong>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {debugData.projectInfo.generated_photos.slice(0, 3).map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Generated ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
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
            {debugData?.recentProjects ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">ID</th>
                      <th className="border border-gray-300 p-2">Name</th>
                      <th className="border border-gray-300 p-2">Status</th>
                      <th className="border border-gray-300 p-2">Photos</th>
                      <th className="border border-gray-300 p-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debugData.recentProjects.map((project: any) => (
                      <tr key={project.id}>
                        <td className="border border-gray-300 p-2">{project.id}</td>
                        <td className="border border-gray-300 p-2">{project.name}</td>
                        <td className="border border-gray-300 p-2">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              project.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : project.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : project.status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-2">{project.photo_count || 0}</td>
                        <td className="border border-gray-300 p-2">
                          {new Date(project.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Loading projects...</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Webhook Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Webhook Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {debugData?.webhookLogs && debugData.webhookLogs.length > 0 ? (
              <div className="space-y-4">
                {debugData.webhookLogs.map((log: any) => (
                  <div key={log.id} className="border border-gray-200 p-4 rounded">
                    <div className="grid grid-cols-4 gap-4 mb-2">
                      <div>
                        <strong>Type:</strong> {log.webhook_type}
                      </div>
                      <div>
                        <strong>Project:</strong> {log.project_id}
                      </div>
                      <div>
                        <strong>Status:</strong> {log.status}
                      </div>
                      <div>
                        <strong>Time:</strong> {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>

                    {log.error_message && (
                      <div className="text-red-600 mb-2">
                        <strong>Error:</strong> {log.error_message}
                      </div>
                    )}

                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600">View Raw Data</summary>
                      <pre className="bg-gray-100 p-2 mt-2 text-sm overflow-x-auto">{log.raw_body}</pre>
                    </details>

                    {log.parsed_data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-blue-600">View Parsed Data</summary>
                        <pre className="bg-gray-100 p-2 mt-2 text-sm overflow-x-auto">
                          {JSON.stringify(JSON.parse(log.parsed_data), null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No webhook logs found. This might be the issue!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
