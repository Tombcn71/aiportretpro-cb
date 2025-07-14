"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: number
  name: string
  status: string
  generated_photos: string
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects()
    }
  }, [status])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const parsePhotos = (photosString: string): string[] => {
    if (!photosString || photosString === "[]" || photosString === "") {
      return []
    }

    try {
      const parsed = JSON.parse(photosString)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error("Error parsing photos:", error)
      return []
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Link href="/wizard/welcome">
          <Button>Create New Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No projects yet</h2>
          <p className="text-gray-600 mb-6">Create your first AI headshot project to get started</p>
          <Link href="/wizard/welcome">
            <Button>Get Started</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const photos = parsePhotos(project.generated_photos)

            return (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {photos.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {photos.slice(0, 4).map((photo, index) => (
                          <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                            <Image
                              src={photo || "/placeholder.svg"}
                              alt={`Generated photo ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </div>
                        ))}
                      </div>
                      {photos.length > 4 && (
                        <p className="text-sm text-gray-600 text-center">+{photos.length - 4} more photos</p>
                      )}
                      <Link href={`/generate/${project.id}`}>
                        <Button className="w-full">View All Photos</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        {project.status === "pending" && "Waiting to start..."}
                        {project.status === "processing" && "Generating photos..."}
                        {project.status === "failed" && "Generation failed"}
                        {project.status === "completed" && "No photos generated"}
                      </p>
                      {project.status === "processing" && (
                        <div className="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
                      )}
                    </div>
                  )}
                  <div className="mt-4 text-xs text-gray-500">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
