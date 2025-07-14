"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugDatabasePage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/debug/database-content")
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error("Error fetching debug data:", error)
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Database Debug</h1>

        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {project.name} (ID: {project.id})
                  </CardTitle>
                  <Badge variant={project.photoAnalysis.validCount > 0 ? "default" : "secondary"}>
                    {project.photoAnalysis.validCount} valid photos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <strong>Status:</strong> {project.status}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(project.created_at).toLocaleString()}
                  </div>
                  <div>
                    <strong>Raw Data Type:</strong> {project.photoAnalysis.type}
                  </div>
                  <div>
                    <strong>Raw Data:</strong>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(project.photoAnalysis.raw, null, 2)}
                    </pre>
                  </div>
                  {project.photoAnalysis.validPhotos.length > 0 && (
                    <div>
                      <strong>Valid Photos:</strong>
                      <ul className="list-disc list-inside">
                        {project.photoAnalysis.validPhotos.map((photo: string, index: number) => (
                          <li key={index} className="text-sm break-all">
                            {photo}
                          </li>
                        ))}
                      </ul>
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
