"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        const response = await fetch("/api/debug/projects")
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

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Info</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total projects: {debugData?.total_projects || 0}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {debugData?.projects?.map((project: any) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Status:</strong> {project.status}
                </div>
                <div>
                  <strong>Photo Count:</strong> {project.photo_count}
                </div>
                <div>
                  <strong>Has Photos:</strong> {project.has_photos ? "Yes" : "No"}
                </div>
                <div>
                  <strong>User:</strong> {project.user_email}
                </div>
                <div className="col-span-2">
                  <strong>First Photo Preview:</strong>
                  <div className="bg-gray-100 p-2 rounded text-xs mt-1 break-all">
                    {project.first_photo_preview || "No photos"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
