"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Eye } from "lucide-react"

export default function DebugProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/debug/projects")
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/debug/check-project/${projectId}`)
      const data = await response.json()
      setSelectedProject(data)
    } catch (error) {
      console.error("Error checking project:", error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  if (loading) {
    return <div className="p-8">Loading projects...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Debug Projects</h1>
          <Button onClick={fetchProjects} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Projects Overview */}
          <Card>
            <CardHeader>
              <CardTitle>All Projects ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-gray-500">No projects found</p>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">
                            #{project.id} - {project.name}
                          </h3>
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
                        <Button onClick={() => checkProject(project.id)} size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Check Details
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Photos:</span> {project.photo_count || 0}
                        </div>
                        <div>
                          <span className="font-medium">User:</span> {project.user_email}
                        </div>
                        <div>
                          <span className="font-medium">Prediction ID:</span> {project.prediction_id || "None"}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {project.has_photos && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                          <span className="font-medium text-green-800">✅ Has Photos:</span>
                          <div className="text-green-700 truncate">{project.first_photo_preview}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Project Details */}
          {selectedProject && (
            <Card>
              <CardHeader>
                <CardTitle>Project #{selectedProject.project?.id} Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Database Info</h4>
                      <div className="space-y-1 text-sm">
                        <div>Name: {selectedProject.project?.name}</div>
                        <div>Status: {selectedProject.project?.status}</div>
                        <div>Photos: {selectedProject.project?.photo_count}</div>
                        <div>Prediction ID: {selectedProject.project?.prediction_id || "None"}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Astria Status</h4>
                      {selectedProject.astria_status ? (
                        <div className="space-y-1 text-sm">
                          <div>ID: {selectedProject.astria_status.id}</div>
                          <div>Status: {selectedProject.astria_status.status}</div>
                          <div>Title: {selectedProject.astria_status.title}</div>
                          <div>Trained: {selectedProject.astria_status.trained_at ? "Yes" : "No"}</div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">No Astria data available</div>
                      )}
                    </div>
                  </div>

                  {selectedProject.debug_info && (
                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-semibold mb-2">Debug Info</h4>
                      <pre className="text-xs">{JSON.stringify(selectedProject.debug_info, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
