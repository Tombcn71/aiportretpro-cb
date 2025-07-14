"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"

interface Project {
  id: number
  name: string
  status: string
  created_at: string
  generated_photos: string | null
  pack_id: string | null
}

interface Credit {
  id: number
  amount: number
  used: boolean
  created_at: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [credits, setCredits] = useState<Credit[]>([])
  const [loading, setLoading] = useState(true)
  const [allPhotos, setAllPhotos] = useState<string[]>([])

  useEffect(() => {
    if (session) {
      fetchProjects()
      fetchCredits()
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])

        // Collect all photos
        const photos: string[] = []
        data.projects?.forEach((project: Project) => {
          if (project.generated_photos) {
            try {
              const parsedPhotos = JSON.parse(project.generated_photos)
              if (Array.isArray(parsedPhotos)) {
                parsedPhotos.forEach((photo) => {
                  if (typeof photo === "string" && photo.includes("astria.ai")) {
                    photos.push(photo)
                  }
                })
              }
            } catch (e) {
              console.log("Error parsing photos for project", project.id)
            }
          }
        })
        setAllPhotos(photos)
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
        setCredits(data.credits || [])
      }
    } catch (error) {
      console.error("Error fetching credits:", error)
    }
  }

  const getValidPhotoCount = (photosString: string | null): number => {
    if (!photosString) return 0
    try {
      const photos = JSON.parse(photosString)
      if (Array.isArray(photos)) {
        return photos.filter((photo) => typeof photo === "string" && photo.includes("astria.ai")).length
      }
    } catch (e) {
      return 0
    }
    return 0
  }

  const getValidPhotos = (photosString: string | null): string[] => {
    if (!photosString) return []
    try {
      const photos = JSON.parse(photosString)
      if (Array.isArray(photos)) {
        return photos.filter((photo) => typeof photo === "string" && photo.includes("astria.ai"))
      }
    } catch (e) {
      return []
    }
    return []
  }

  // Filter projects that have actual photos
  const projectsWithPhotos = projects.filter((project) => getValidPhotoCount(project.generated_photos) > 0)

  const availableCredits = credits.filter((credit) => !credit.used).length
  const usedCredits = credits.filter((credit) => credit.used).length

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welkom terug, {session.user?.name}</p>
        </div>

        {/* Credits Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Beschikbare Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableCredits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Gebruikte Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{usedCredits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Totaal Projecten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0077B5]">{projectsWithPhotos.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {availableCredits > 0 ? (
              <Button asChild className="bg-[#0077B5] hover:bg-[#005885]">
                <Link href="/use-credit">Gebruik Credit voor Nieuwe Fotoshoot</Link>
              </Button>
            ) : (
              <Button asChild className="bg-[#0077B5] hover:bg-[#005885]">
                <Link href="/pricing">Koop Credits</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Projects */}
        {projectsWithPhotos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Jouw Projecten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsWithPhotos.map((project) => {
                const photoCount = getValidPhotoCount(project.generated_photos)
                const photos = getValidPhotos(project.generated_photos)

                return (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                          {project.status === "completed" ? "Voltooid" : project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(project.created_at).toLocaleDateString("nl-NL")}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{photoCount} foto's gegenereerd</span>
                          <Button size="sm" asChild>
                            <Link href={`/generate/${project.id}`}>Bekijk Foto's</Link>
                          </Button>
                        </div>

                        {photos.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {photos.slice(0, 3).map((photo, index) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={photo || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* All Photos Gallery */}
        {allPhotos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alle Portretfotos ({allPhotos.length} foto's)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Portret ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {projectsWithPhotos.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nog geen projecten</h3>
              <p className="text-gray-600 mb-6">Start je eerste fotoshoot om professionele portretten te maken.</p>
              {availableCredits > 0 ? (
                <Button asChild className="bg-[#0077B5] hover:bg-[#005885]">
                  <Link href="/use-credit">Start Fotoshoot</Link>
                </Button>
              ) : (
                <Button asChild className="bg-[#0077B5] hover:bg-[#005885]">
                  <Link href="/pricing">Koop Credits</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
