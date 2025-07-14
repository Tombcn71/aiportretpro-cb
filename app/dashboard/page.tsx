"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Camera, CreditCard, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: number
  name: string
  status: string
  created_at: string
  generated_photos: string | string[] | null
}

interface UserCredits {
  credits: number
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [credits, setCredits] = useState<UserCredits>({ credits: 0 })
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, creditsResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/credits/balance"),
        ])

        if (!projectsResponse.ok || !creditsResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const projectsData = await projectsResponse.json()
        const creditsData = await creditsResponse.json()

        setProjects(projectsData)
        setCredits(creditsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        setCredits({ credits: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to count valid photos in a project
  const getValidPhotoCount = (project: Project): number => {
    if (!project.generated_photos) return 0

    let photos: string[] = []
    try {
      if (typeof project.generated_photos === "string") {
        if (project.generated_photos.startsWith("[")) {
          photos = JSON.parse(project.generated_photos)
        } else if (project.generated_photos.includes("astria.ai")) {
          photos = [project.generated_photos]
        }
      } else if (Array.isArray(project.generated_photos)) {
        photos = project.generated_photos
      }
    } catch (e) {
      return 0
    }

    return photos.filter(
      (photo) =>
        photo &&
        typeof photo === "string" &&
        photo.length > 20 &&
        (photo.includes("astria.ai") || photo.includes("mp.astria.ai")),
    ).length
  }

  // STRICT filtering: only show projects with actual photos
  const projectsWithPhotos = projects.filter((project) => {
    const photoCount = getValidPhotoCount(project)
    return photoCount > 0
  })

  // Parse all valid photos for gallery
  const allPhotos = projectsWithPhotos.flatMap((project) => {
    let photos: string[] = []

    if (project.generated_photos) {
      try {
        if (typeof project.generated_photos === "string") {
          if (project.generated_photos.startsWith("[")) {
            photos = JSON.parse(project.generated_photos)
          } else {
            photos = [project.generated_photos]
          }
        } else if (Array.isArray(project.generated_photos)) {
          photos = project.generated_photos
        }
      } catch (e) {
        photos = []
      }
    }

    const validPhotos = photos.filter(
      (photo) =>
        photo &&
        typeof photo === "string" &&
        photo.length > 20 &&
        (photo.includes("astria.ai") || photo.includes("mp.astria.ai")),
    )

    return validPhotos.map((photo: string, index: number) => ({
      url: photo,
      projectName: project.name,
      projectId: project.id,
      index: index,
      key: `${project.id}-${index}`,
    }))
  })

  const handleImageError = (photoKey: string) => {
    setImageErrors((prev) => new Set([...prev, photoKey]))
  }

  const downloadPhoto = (photoUrl: string, projectName: string, index: number) => {
    const link = document.createElement("a")
    link.href = photoUrl
    link.download = `${projectName}_portretfoto_${index + 1}.jpg`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

        {/* Credits Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-[#0077B5] to-[#004182] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Jouw Tegoed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {credits.credits} project{credits.credits !== 1 ? "en" : ""} over
                  </p>
                  <p className="text-blue-100">Maak professionele portetfotos</p>
                </div>
                <div>
                  {credits.credits > 0 ? (
                    <Link href="/use-credit">
                      <Button className="bg-white text-[#0077B5] hover:bg-gray-100 font-semibold">
                        Start Nieuw Project
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/pricing">
                      <Button className="bg-white text-[#0077B5] hover:bg-gray-100 font-semibold">Koop Tegoed</Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Overview - ONLY projects with photos */}
        {projectsWithPhotos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Jouw Projecten</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projectsWithPhotos.map((project) => {
                const photoCount = getValidPhotoCount(project)

                return (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Voltooid
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(project.created_at).toLocaleDateString("nl-NL")}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">{photoCount} foto's gegenereerd</p>
                        <Link href={`/generate/${project.id}`}>
                          <Button size="sm" variant="outline">
                            Bekijk Foto's
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Photos Gallery */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Alle Portetfotos ({allPhotos.length} foto's)</h2>

          {allPhotos.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">Nog geen portetfotos</h3>
              <p className="text-gray-600 mb-8">
                {credits.credits > 0
                  ? "Je hebt tegoed! Start je eerste project."
                  : "Koop tegoed om je eerste professionele portetfotos te maken."}
              </p>
              {credits.credits > 0 ? (
                <Link href="/use-credit">
                  <Button className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-3">Start Nieuw Project</Button>
                </Link>
              ) : (
                <Link href="/pricing">
                  <Button className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-3">Portetfotos maken</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allPhotos
                .filter((photo) => !imageErrors.has(photo.key))
                .map((photo) => (
                  <div key={photo.key} className="group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow">
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={`Portretfoto ${photo.index + 1} van ${photo.projectName}`}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(photo.key)}
                        unoptimized
                        crossOrigin="anonymous"
                      />
                    </div>
                    <Button
                      onClick={() => downloadPhoto(photo.url, photo.projectName, photo.index)}
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Success message */}
        {allPhotos.length > 0 && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
                Geweldig! Je hebt {allPhotos.length} professionele portetfotos klaar voor download.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
