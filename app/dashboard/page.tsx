"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, Loader2 } from "lucide-react"

interface Project {
  id: number
  name: string
  status: string
  created_at: string
  generated_photos: string | string[]
  gender: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showPhotos, setShowPhotos] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchProjects()
    }
  }, [status, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const parsePhotos = (photos: string | string[]): string[] => {
    if (!photos) return []

    try {
      if (typeof photos === "string") {
        const parsed = JSON.parse(photos)
        return Array.isArray(parsed) ? parsed : []
      }
      return Array.isArray(photos) ? photos : []
    } catch (e) {
      console.log("Error parsing photos:", e)
      return []
    }
  }

  const isValidPhotoUrl = (url: string): boolean => {
    return (
      url && typeof url === "string" && url.length > 10 && (url.startsWith("http://") || url.startsWith("https://"))
    )
  }

  const getValidPhotos = (project: Project): string[] => {
    const photos = parsePhotos(project.generated_photos)
    const validPhotos = photos.filter(isValidPhotoUrl)

    console.log(`Project ${project.name}: ${photos.length} total, ${validPhotos.length} valid photos`)

    return validPhotos
  }

  const getAllPhotos = (): string[] => {
    const allPhotos: string[] = []
    projects.forEach((project) => {
      const validPhotos = getValidPhotos(project)
      allPhotos.push(...validPhotos)
    })
    return allPhotos
  }

  const downloadPhoto = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Error downloading photo:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500"
      case "training":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const allPhotos = getAllPhotos()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welkom terug, {session?.user?.name}</p>
        </div>
        <Button onClick={() => router.push("/wizard/welcome")}>Nieuwe Fotoshoot</Button>
      </div>

      {/* All Photos Section */}
      {allPhotos.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Alle Portetfotos ({allPhotos.length} foto's)</span>
              <Button variant="outline" onClick={() => setShowPhotos(!showPhotos)}>
                <Eye className="h-4 w-4 mr-2" />
                {showPhotos ? "Verberg" : "Bekijk Alle"}
              </Button>
            </CardTitle>
          </CardHeader>
          {showPhotos && (
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Portrait ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-500">
                              <div class="text-center">
                                <div>⚠️</div>
                                <div>Foto niet beschikbaar</div>
                                <div class="text-xs mt-1">${photo.substring(0, 30)}...</div>
                              </div>
                            </div>
                          `
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => downloadPhoto(photo, `portrait-${index + 1}.jpg`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const validPhotos = getValidPhotos(project)

          return (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-gray-500 capitalize">{project.gender}</p>
                  </div>
                  <Badge className={`${getStatusColor(project.status)} text-white`}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>Aangemaakt: {new Date(project.created_at).toLocaleDateString("nl-NL")}</p>
                    <p>Foto's: {validPhotos.length}</p>
                  </div>

                  {validPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {validPhotos.slice(0, 6).map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt={`${project.name} ${index + 1}`}
                          className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => {
                            setSelectedProject(project)
                            setShowPhotos(true)
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {validPhotos.length > 6 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setSelectedProject(project)
                        setShowPhotos(true)
                      }}
                    >
                      Bekijk alle {validPhotos.length} foto's
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Nog geen projecten</h2>
          <p className="text-gray-600 mb-6">Start je eerste AI fotoshoot om aan de slag te gaan!</p>
          <Button onClick={() => router.push("/wizard/welcome")}>Start Nieuwe Fotoshoot</Button>
        </div>
      )}

      {/* Selected Project Modal */}
      {selectedProject && showPhotos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProject(null)
                    setShowPhotos(false)
                  }}
                >
                  Sluiten
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getValidPhotos(selectedProject).map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`${selectedProject.name} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => downloadPhoto(photo, `${selectedProject.name}-${index + 1}.jpg`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
