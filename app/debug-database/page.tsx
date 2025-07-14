"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: number
  name: string
  status: string
  created_at: string
  generated_photos: string | null
  pack_id: string | null
  user_email: string
  photoCount: number
}

interface Credit {
  id: number
  user_email: string
  amount: number
  used: boolean
  created_at: string
}

export default function DatabaseDebug() {
  const [data, setData] = useState<{ projects: Project[]; credits: Credit[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/debug/database-content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setData(data)
        } else {
          setError(data.error)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Database Debug</h1>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Database Debug</h1>
          <Card>
            <CardContent className="p-6">
              <p className="text-red-600">Error: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Debug</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Projects ({data?.projects.length})</h2>
            <div className="space-y-4">
              {data?.projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={project.photoCount > 0 ? "default" : "secondary"}>
                        {project.photoCount} photos
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>ID:</strong> {project.id}
                      </p>
                      <p>
                        <strong>Status:</strong> {project.status}
                      </p>
                      <p>
                        <strong>User:</strong> {project.user_email}
                      </p>
                      <p>
                        <strong>Pack ID:</strong> {project.pack_id || "None"}
                      </p>
                      <p>
                        <strong>Created:</strong> {new Date(project.created_at).toLocaleString()}
                      </p>
                      <p>
                        <strong>Has Photos:</strong> {project.photoCount > 0 ? "Yes" : "No"}
                      </p>
                      {project.generated_photos && (
                        <details className="mt-2">
                          <summary className="cursor-pointer font-medium">Raw Photos Data</summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                            {project.generated_photos}
                          </pre>
                        </details>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Credits */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Credits ({data?.credits.length})</h2>
            <div className="space-y-4">
              {data?.credits.map((credit) => (
                <Card key={credit.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <p>
                          <strong>ID:</strong> {credit.id}
                        </p>
                        <Badge variant={credit.used ? "secondary" : "default"}>
                          {credit.used ? "Used" : "Available"}
                        </Badge>
                      </div>
                      <p>
                        <strong>User:</strong> {credit.user_email}
                      </p>
                      <p>
                        <strong>Amount:</strong> {credit.amount}
                      </p>
                      <p>
                        <strong>Created:</strong> {new Date(credit.created_at).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
