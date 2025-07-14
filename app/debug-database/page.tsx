"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DebugDatabasePage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/debug/database-content")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Debug data received:", data)
        setProjects(data)
      } catch (error) {
        console.error("Error fetching debug data:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
            <Link href="/dashboard">
              <Button className="mt-4">Terug naar Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Database Debug</h1>
          <Link href="/dashboard">
            <Button variant="outline">Terug naar Dashboard</Button>
          </Link>
        </div>

        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                  <div className="text-sm text-gray-600">Totaal Projecten</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {projects.filter((p) => p.photoAnalysis.validCount > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Met Echte Foto's</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {projects.filter((p) => p.photoAnalysis.raw && p.photoAnalysis.validCount === 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Met Fake Data</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {projects.reduce((sum, p) => sum + p.photoAnalysis.validCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Totaal Echte Foto's</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {project.name} (ID: {project.id})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={project.photoAnalysis.validCount > 0 ? "default" : "secondary"}>
                      {project.photoAnalysis.validCount} echte foto's
                    </Badge>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Aangemaakt:</strong> {new Date(project.created_at).toLocaleString("nl-NL")}
                    </div>
                    <div>
                      <strong>Data Type:</strong> {project.photoAnalysis.type}
                    </div>
                  </div>

                  {project.photoAnalysis.validPhotos.length > 0 && (
                    <div>
                      <strong>Echte Foto URLs:</strong>
                      <div className="mt-2 space-y-1">
                        {project.photoAnalysis.validPhotos.slice(0, 3).map((photo: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">
                              VALID
                            </Badge>
                            <span className="text-xs font-mono break-all">{photo}</span>
                          </div>
                        ))}
                        {project.photoAnalysis.validPhotos.length > 3 && (
                          <div className="text-sm text-gray-600">
                            ... en {project.photoAnalysis.validPhotos.length - 3} meer
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <details className="mt-4">
                    <summary className="cursor-pointer font-medium">Raw Database Data</summary>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto mt-2">
                      {JSON.stringify(project.photoAnalysis.raw, null, 2)}
                    </pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
