"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function DebugAstriaPage() {
  const [debugData, setDebugData] = useState<any>(null)
  const [projectId, setProjectId] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchDebugData = async (pid?: string) => {
    setLoading(true)
    try {
      const url = pid ? `/api/debug/astria-flow?projectId=${pid}` : "/api/debug/astria-flow"
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
    } else {
      fetchDebugData()
    }
  }

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Astria Debug Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Project Search</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input placeholder="Enter Project ID" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
          <Button onClick={handleProjectSearch}>Search</Button>
          <Button
            variant="outline"
            onClick={() => {
              setProjectId("")
              fetchDebugData()
            }}
          >
            Show All
          </Button>
        </CardContent>
      </Card>

      {debugData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Environment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <p>
                  <strong>Webhook Secret:</strong> {debugData.envInfo.webhookSecret}
                </p>
                <p>
                  <strong>NextAuth URL:</strong> {debugData.envInfo.nextAuthUrl}
                </p>
                <p>
                  <strong>Astria API Key:</strong> {debugData.envInfo.astriaApiKey}
                </p>
              </div>
            </CardContent>
          </Card>

          {debugData.projectInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <p>
                    <strong>ID:</strong> {debugData.projectInfo.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {debugData.projectInfo.name}
                  </p>
                  <p>
                    <strong>Status:</strong> {debugData.projectInfo.status}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(debugData.projectInfo.created_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated:</strong> {new Date(debugData.projectInfo.updated_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Generated Photos:</strong> {debugData.projectInfo.generated_photos?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Webhook Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {debugData.webhookLogs.length === 0 ? (
                <p className="text-red-600">No webhook logs found. This might be the issue!</p>
              ) : (
                <div className="space-y-4">
                  {debugData.webhookLogs.map((log: any, index: number) => (
                    <div key={index} className="p-4 border rounded">
                      <p>
                        <strong>Project ID:</strong> {log.project_id}
                      </p>
                      <p>
                        <strong>Status:</strong> {log.status}
                      </p>
                      <p>
                        <strong>Time:</strong> {new Date(log.created_at).toLocaleString()}
                      </p>
                      {log.error_message && (
                        <p>
                          <strong>Error:</strong> {log.error_message}
                        </p>
                      )}
                      <details className="mt-2">
                        <summary>Raw Body</summary>
                        <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-auto">{log.raw_body}</pre>
                      </details>
                      {log.parsed_data && (
                        <details className="mt-2">
                          <summary>Parsed Data</summary>
                          <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-auto">
                            {JSON.stringify(JSON.parse(log.parsed_data), null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {debugData.recentProjects.map((project: any) => (
                  <div key={project.id} className="p-3 border rounded flex justify-between">
                    <div>
                      <p>
                        <strong>#{project.id}</strong> - {project.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: {project.status} | Photos: {project.photo_count || 0}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setProjectId(project.id.toString())
                        fetchDebugData(project.id.toString())
                      }}
                    >
                      Debug
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
