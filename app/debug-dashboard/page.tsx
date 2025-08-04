"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DebugDashboardPage() {
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [webhookTestResult, setWebhookTestResult] = useState<any>(null)

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        const response = await fetch("/api/debug/webhook-test")
        const data = await response.json()
        setDebugData(data)
      } catch (error) {
        console.error("Error fetching debug data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDebugData()
  }, [])

  const testWebhook = async () => {
    try {
      setWebhookTestResult({ loading: true })

      const response = await fetch("/api/debug/test-webhooks", {
        method: "POST",
      })

      const result = await response.json()
      setWebhookTestResult(result)
    } catch (error) {
      setWebhookTestResult({
        error: "Webhook test failed: " + (error instanceof Error ? error.message : "Unknown error"),
      })
    }
  }

  if (loading) {
    return <div className="p-8">Loading debug data...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Debug</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{debugData?.debug_info?.total_projects || 0}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {debugData?.debug_info?.projects_with_photos || 0}
                </div>
                <div className="text-sm text-gray-600">With Photos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {debugData?.debug_info?.projects_training || 0}
                </div>
                <div className="text-sm text-gray-600">Training</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {debugData?.debug_info?.projects_processing || 0}
                </div>
                <div className="text-sm text-gray-600">Processing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {debugData?.recent_projects?.map((project: any) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <Badge
                      variant={
                        project.status === "completed"
                          ? "default"
                          : project.status === "training"
                            ? "secondary"
                            : project.status === "processing"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>ID: {project.id}</div>
                    <div>Photos: {project.photo_count || 0}</div>
                    <div>Prediction ID: {project.prediction_id || "None"}</div>
                    <div>Created: {new Date(project.created_at).toLocaleString()}</div>
                  </div>
                  {project.generated_photos && project.generated_photos.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">First photo URL:</div>
                      <div className="text-xs bg-gray-100 p-1 rounded truncate">
                        {project.generated_photos[0].substring(0, 100)}...
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testWebhook} className="mb-4" disabled={webhookTestResult?.loading}>
              {webhookTestResult?.loading ? "Testing..." : "Test Webhooks Manually"}
            </Button>
            <p className="text-sm text-gray-600 mb-4">This will test if the webhook endpoints are working correctly.</p>

            {webhookTestResult && !webhookTestResult.loading && (
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-2">Test Result:</h4>
                <pre className="text-xs overflow-auto">{JSON.stringify(webhookTestResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
