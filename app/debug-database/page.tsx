"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface PhotoAnalysis {
  raw: any
  type: string
  length: number
  parsed: any
  validCount: number
  isValidProject: boolean
}

interface ProjectAnalysis {
  id: number
  name: string
  status: string
  created_at: string
  photoAnalysis: PhotoAnalysis
}

interface DatabaseAnalysis {
  summary: {
    totalProjects: number
    projectsWithValidPhotos: number
    projectsWithNoPhotos: number
    projectsWithInvalidPhotos: number
    totalValidPhotos: number
  }
  projects: ProjectAnalysis[]
}

export default function DatabaseDebugPage() {
  const [data, setData] = useState<DatabaseAnalysis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/debug/database-content")
        if (!response.ok) throw new Error("Failed to fetch")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching database analysis:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">
          <p className="text-red-600">Failed to load database analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug naar Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Debug
          </h1>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{data.summary.totalProjects}</div>
              <div className="text-sm text-gray-600">Totaal Projecten</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{data.summary.projectsWithValidPhotos}</div>
              <div className="text-sm text-gray-600">Met Echte Foto's</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{data.summary.projectsWithInvalidPhotos}</div>
              <div className="text-sm text-gray-600">Met Fake Foto's</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{data.summary.projectsWithNoPhotos}</div>
              <div className="text-sm text-gray-600">Geen Foto's</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{data.summary.totalValidPhotos}</div>
              <div className="text-sm text-gray-600">Echte Foto's</div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Project Details</h2>
          {data.projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {project.photoAnalysis.isValidProject ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : project.photoAnalysis.raw ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400" />
                    )}
                    {project.name} (ID: {project.id})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={project.photoAnalysis.isValidProject ? "default" : "secondary"}>
                      {project.photoAnalysis.validCount} echte foto's
                    </Badge>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <strong>Aangemaakt:</strong> {new Date(project.created_at).toLocaleString("nl-NL")}
                  </div>
                  <div>
                    <strong>Foto Data Type:</strong> {project.photoAnalysis.type}
                  </div>
                  <div>
                    <strong>Data Lengte:</strong> {project.photoAnalysis.length} characters
                  </div>
                  {project.photoAnalysis.raw && (
                    <div>
                      <strong>Raw Data:</strong>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mt-1">
                        {typeof project.photoAnalysis.raw === "string"
                          ? project.photoAnalysis.raw.slice(0, 200) +
                            (project.photoAnalysis.raw.length > 200 ? "..." : "")
                          : JSON.stringify(project.photoAnalysis.raw, null, 2).slice(0, 200) + "..."}
                      </pre>
                    </div>
                  )}
                  {project.photoAnalysis.parsed && typeof project.photoAnalysis.parsed !== "string" && (
                    <div>
                      <strong>
                        Parsed URLs (
                        {Array.isArray(project.photoAnalysis.parsed) ? project.photoAnalysis.parsed.length : 1}):
                      </strong>
                      <div className="space-y-1 mt-1">
                        {(Array.isArray(project.photoAnalysis.parsed)
                          ? project.photoAnalysis.parsed
                          : [project.photoAnalysis.parsed]
                        )
                          .slice(0, 3)
                          .map((url: string, index: number) => (
                            <div key={index} className="text-xs">
                              <Badge variant={url.includes("astria.ai") ? "default" : "destructive"} className="mr-2">
                                {url.includes("astria.ai") ? "VALID" : "INVALID"}
                              </Badge>
                              {url.slice(0, 80)}...
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
