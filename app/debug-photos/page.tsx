"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Camera, Database, Webhook } from "lucide-react"

interface PhotoDebugData {
  summary: {
    totalProjects: number
    projectsWithPhotos: number
    projectsWithoutPhotos: number
    totalWebhookLogs: number
  }
  projectsWithPhotos: Array<{
    id: number
    name: string
    status: string
    photoCount: number
    created: string
    updated: string
  }>
  projectsWithoutPhotos: Array<{
    id: number
    name: string
    status: string
    created: string
  }>
  samplePhotos: Array<{
    projectId: number
    projectName: string
    photoCount: number
    firstFewPhotos: string[]
  }>
  recentWebhooks: Array<{
    id: number
    projectId: number
    status: string
    hasImages: boolean
    imageCount: number
    created: string
    error?: string
  }>
}

export default function DebugPhotosPage() {
  const [data, setData] = useState<PhotoDebugData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/debug/check-photos")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching photo debug data:", error)
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
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Fout bij laden data</h2>
              <Button onClick={fetchData}>Probeer opnieuw</Button>
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
          <h1 className="text-3xl font-bold">Database Foto Check</h1>
          <Button onClick={fetchData} variant="outline">
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Totaal Projecten</p>
                  <p className="text-2xl font-bold">{data.summary.totalProjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Met Foto's</p>
                  <p className="text-2xl font-bold text-green-600">{data.summary.projectsWithPhotos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Zonder Foto's</p>
                  <p className="text-2xl font-bold text-red-600">{data.summary.projectsWithoutPhotos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Webhook className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Webhook Logs</p>
                  <p className="text-2xl font-bold">{data.summary.totalWebhookLogs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects with Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Projecten MET Foto's ({data.projectsWithPhotos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.projectsWithPhotos.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      #{project.id} - {project.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: <Badge variant="outline">{project.status}</Badge> | Gemaakt:{" "}
                      {new Date(project.created).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{project.photoCount} foto's</p>
                    <p className="text-xs text-gray-500">
                      {project.photoCount === 40 ? "✅ Volledig" : "⚠️ Onvolledig"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects without Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Projecten ZONDER Foto's ({data.projectsWithoutPhotos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.projectsWithoutPhotos.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      #{project.id} - {project.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: <Badge variant="outline">{project.status}</Badge> | Gemaakt:{" "}
                      {new Date(project.created).toLocaleDateString("nl-NL")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">0 foto's</p>
                    <p className="text-xs text-red-500">❌ Geen foto's ontvangen</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sample Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-500" />
              Voorbeeld Foto's
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.samplePhotos.map((sample) => (
                <div key={sample.projectId} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">
                    #{sample.projectId} - {sample.projectName} ({sample.photoCount} foto's)
                  </h4>
                  <div className="space-y-1">
                    {sample.firstFewPhotos.map((photo, index) => (
                      <p key={index} className="text-xs text-gray-600 font-mono break-all">
                        {index + 1}. {photo}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Webhooks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5 text-purple-500" />
              Recente Webhooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recentWebhooks.slice(0, 10).map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm">
                      Project #{webhook.projectId} | Status: {webhook.status}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(webhook.created).toLocaleString("nl-NL")}</p>
                  </div>
                  <div className="text-right">
                    {webhook.hasImages ? (
                      <Badge className="bg-green-100 text-green-800">{webhook.imageCount} foto's</Badge>
                    ) : (
                      <Badge variant="secondary">Geen foto's</Badge>
                    )}
                    {webhook.error && <p className="text-xs text-red-500 mt-1">{webhook.error}</p>}
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
