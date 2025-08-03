"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Trash2 } from "lucide-react"

interface Project {
  id: number
  name: string
  status: string
  generated_photos: string[]
  created_at: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user?.email) {
      fetchProjects()
      fetchCredits()
    }
  }, [session, status, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        // Only show completed projects
        const completedProjects = data.filter(
          (project: Project) => project.status === "completed" && project.generated_photos?.length > 0,
        )
        setProjects(completedProjects)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits/balance")
      if (response.ok) {
        const data = await response.json()
        setCredits(data.balance || 0)
      }
    } catch (error) {
      console.error("Error fetching credits:", error)
    }
  }

  const deletePhoto = async (projectId: number, photoUrl: string) => {
    try {
      const response = await fetch("/api/photos/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, photoUrl }),
      })

      if (response.ok) {
        fetchProjects() // Refresh projects
      }
    } catch (error) {
      console.error("Error deleting photo:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welkom terug, {session?.user?.email}</p>
          </div>
          <Button
            onClick={() => router.push("/wizard/welcome")}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Nieuwe Fotoshoot
          </Button>
        </div>

        {/* Credits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{credits}</div>
              <p className="text-gray-600">Beschikbare credits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projecten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{projects.length}</div>
              <p className="text-gray-600">Voltooide projecten</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Foto's</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {projects.reduce((total, project) => total + (project.generated_photos?.length || 0), 0)}
              </div>
              <p className="text-gray-600">Gegenereerde foto's</p>
            </CardContent>
          </Card>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Je Foto's</h2>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 mb-4">Je hebt nog geen voltooide projecten.</p>
                <Button
                  onClick={() => router.push("/wizard/welcome")}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Start je eerste fotoshoot
                </Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <p className="text-gray-600">{new Date(project.created_at).toLocaleDateString("nl-NL")}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Voltooid
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {project.generated_photos?.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`${project.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                            <button
                              onClick={() => window.open(photo, "_blank")}
                              className="p-2 bg-white rounded-full hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <a href={photo} download className="p-2 bg-white rounded-full hover:bg-gray-100">
                              <Download className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => deletePhoto(project.id, photo)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
