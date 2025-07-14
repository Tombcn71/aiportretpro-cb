"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Search, Eye } from "lucide-react"
import Link from "next/link"

interface WebhookLog {
  id: number
  webhook_type: string
  project_id: number | null
  raw_body: string
  parsed_data: any
  status: string
  error_message: string | null
  created_at: string
  photoCount: number
}

interface Project {
  id: number
  name: string
  status: string
  generated_photos: string[]
  created_at: string
  photoCount: number
}

interface DebugData {
  environment: {
    webhookSecret: string
    nextAuthUrl: string
    databaseUrl: string
  }
  webhookLogs: WebhookLog[]
  projects: Project[]
}

export default function DebugAstriaPage() {
  const [data, setData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchProject, setSearchProject] = useState("")
  const [showAll, setShowAll] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/astria-flow")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch debug data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredLogs =
    data?.webhookLogs.filter((log) => !searchProject || log.project_id?.toString().includes(searchProject)) || []

  const displayedLogs = showAll ? filteredLogs : filteredLogs.slice(0, 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Debug Astria Flow</h1>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <input
                type="text"
                placeholder="Search Project ID"
                value={searchProject}
                onChange={(e) => setSearchProject(e.target.value)}
                className="px-3 py-2 border rounded-md"
              />
            </div>
            <Button onClick={() => setShowAll(!showAll)} variant="outline">
              {showAll ? "Show Less" : "Show All"}
            </Button>
            <Button onClick={fetchData} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Environment Check */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium">Webhook Secret:</p>
                <p className={data?.environment.webhookSecret.includes("✅") ? "text-green-600" : "text-red-600"}>
                  {data?.environment.webhookSecret} {data?.environment.webhookSecret.includes("✅") && "(20 chars)"}
                </p>
              </div>
              <div>
                <p className="font-medium">NextAuth URL:</p>
                <p className="text-sm text-gray-600">{data?.environment.nextAuthUrl}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Webhook Logs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Webhook Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Project ID: {log.project_id || "N/A"}</Badge>
                      <Badge variant="secondary">Type: {log.webhook_type}</Badge>
                      <Badge variant="outline">Method: {log.raw_body ? "POST" : "N/A"}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          log.status.includes("success") ||
                          log.status.includes("parsed") ||
                          log.status.includes("processed")
                            ? "bg-green-100 text-green-800"
                            : log.status.includes("failed") || log.status.includes("error")
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        Processed:{" "}
                        {log.status.includes("success") ||
                        log.status.includes("parsed") ||
                        log.status.includes("processed")
                          ? "✅ Yes"
                          : "❌ No"}
                      </Badge>
                      <span className="text-sm text-gray-500">{new Date(log.created_at).toLocaleString("nl-NL")}</span>
                    </div>
                  </div>

                  {log.error_message && (
                    <div className="mb-2">
                      <p className="text-red-600 text-sm">
                        <strong>Error:</strong> {log.error_message}
                      </p>
                    </div>
                  )}

                  {log.parsed_data && (
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium mb-1">Body:</p>
                      <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(log.parsed_data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.projects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div>
                    <h3 className="font-medium">
                      #{project.id} - {project.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: {project.status} | Photos: {project.photoCount} | Created:{" "}
                      {new Date(project.created_at).toLocaleString("nl-NL")}
                    </p>
                  </div>
                  <Link href={`/generate/${project.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Debug This Project
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/debug-webhook-test">
            <Button>Test Webhooks</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
