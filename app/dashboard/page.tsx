"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Camera, CreditCard, Plus } from "lucide-react"
import Link from "next/link"

interface Project {
  id: number
  name: string
  status: string
  created_at: string
  generated_photos: any
  pack_id?: string
}

interface Credit {
  id: number
  amount: number
  used: boolean
  created_at: string
}

function getValidPhotoCount(generatedPhotos: any): number {
  if (!generatedPhotos) return 0

  try {
    let photos: string[] = []

    if (typeof generatedPhotos === "string") {
      if (generatedPhotos.startsWith("[")) {
        photos = JSON.parse(generatedPhotos)
      } else {
        photos = [generatedPhotos]
      }
    } else if (Array.isArray(generatedPhotos)) {
      photos = generatedPhotos
    }

    return photos.filter((photo: any) => {
      if (!photo || typeof photo !== "string") return false
      if (photo.length < 30) return false
      if (!photo.startsWith("http")) return false
      if (!photo.includes("astria.ai") && !photo.includes("mp.astria.ai")) return false
      if (photo.includes("placeholder")) return false
      return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(photo)
    }).length
  } catch (error) {
    console.error("Error parsing photos:", error)
    return 0
  }
}

function getValidPhotos(generatedPhotos: any): string[] {
  if (!generatedPhotos) return []

  try {
    let photos: string[] = []

    if (typeof generatedPhotos === "string") {
      if (generatedPhotos.startsWith("[")) {
        photos = JSON.parse(generatedPhotos)
      } else {
        photos = [generatedPhotos]
      }
    } else if (Array.isArray(generatedPhotos)) {
      photos = generatedPhotos
    }

    return photos.filter((photo: any) => {
      if (!photo || typeof photo !== "string") return false
      if (photo.length < 30) return false
      if (!photo.startsWith("http")) return false
      if (!photo.includes("astria.ai") && !photo.includes("mp.astria.ai")) return false
      if (photo.includes("placeholder")) return false
      return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(photo)
    })
  } catch (error) {
    console.error("Error parsing photos:", error)
    return []
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [credits, setCredits] = useState<Credit[]>([])
  const [loading, setLoading] = useState(true)
  const [allPhotos, setAllPhotos] = useState<string[]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      const [projectsRes, creditsRes] = await Promise.all([fetch("/api/projects"), fetch("/api/credits/balance")])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        console.log("Raw projects data:", projectsData)

        // Filter projects with valid photos
        const validProjects = projectsData.filter((project: Project) => {
          const photoCount = getValidPhotoCount(project.generated_photos)
          console.log(`Project ${project.name} (${project.id}): ${photoCount} valid photos`)
          return photoCount > 0
        })

        console.log("Valid projects:", validProjects)
        setProjects(validProjects)

        // Collect all photos
        const photos: string[] = []
        validProjects.forEach((project: Project) => {
          const projectPhotos = getValidPhotos(project.generated_photos)
          photos.push(...projectPhotos)
        })
        setAllPhotos(photos)
      }

      if (creditsRes.ok) {
        const creditsData = await creditsRes.json()
        setCredits(creditsData.credits || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

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

  if (status === "unauthenticated") {
    return null
  }

  const availableCredits = credits.filter((credit) => !credit.used).length
  const totalPhotos = allPhotos.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welkom terug! Hier zie je al je AI portretten.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-[#0077B5]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Beschikbare Credits</p>
                  <p className="text-2xl font-bold text-gray-900">{availableCredits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Camera className="h-8 w-8 text-[#0077B5]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Totaal Foto's</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPhotos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-[#0077B5]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projecten</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {availableCredits > 0 ? (
            <Link href="/use-credit">
              <Button className="bg-[#0077B5] hover:bg-[#005885] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nieuwe Fotoshoot
              </Button>
            </Link>
          ) : (
            <Link href="/pricing">
              <Button className="bg-[#0077B5] hover:bg-[#005885] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Credits Kopen
              </Button>
            </Link>
          )}
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => {
              const photoCount = getValidPhotoCount(project.generated_photos)
              const photos = getValidPhotos(project.generated_photos)

              return (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                        {project.status === "completed" ? "Voltooid" : "Bezig"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{new Date(project.created_at).toLocaleDateString("nl-NL")}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{photoCount} foto's gegenereerd</span>
                        <Link href={`/generate/${project.id}`}>
                          <Button size="sm" variant="outline">
                            Bekijk Foto's
                          </Button>
                        </Link>
                      </div>

                      {photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {photos.slice(0, 3).map((photo, index) => (
                            <div key={index} className="aspect-square relative overflow-hidden rounded-md">
                              <img
                                src={photo || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                }}
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
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen projecten</h3>
              <p className="text-gray-600 mb-6">
                Start je eerste AI fotoshoot om professionele portretten te genereren.
              </p>
              {availableCredits > 0 ? (
                <Link href="/use-credit">
                  <Button className="bg-[#0077B5] hover:bg-[#005885] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Fotoshoot
                  </Button>
                </Link>
              ) : (
                <Link href="/pricing">
                  <Button className="bg-[#0077B5] hover:bg-[#005885] text-white">Credits Kopen</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Photos Section */}
        {totalPhotos > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Alle Portretfotos ({totalPhotos} foto's)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allPhotos.map((photo, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Portrait ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(photo, "_blank")}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
