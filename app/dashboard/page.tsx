"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Camera, CreditCard, Trash2, X, CheckCircle } from "lucide-react"
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

interface PhotoItem {
  url: string
  projectName: string
  projectId: number
  index: number
  key: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [credits, setCredits] = useState<UserCredits>({ credits: 0 })
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [deletingPhotos, setDeletingPhotos] = useState<Set<string>>(new Set())
  const [showDeleteMode, setShowDeleteMode] = useState(false)

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

        console.log("Dashboard data:", { projectsData, creditsData })

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

  // Parse generated photos and filter out invalid ones
  const allPhotos = projects.flatMap((project) => {
    let photos: string[] = []

    if (project.generated_photos) {
      try {
        if (typeof project.generated_photos === "string") {
          if (project.generated_photos.startsWith("[") && project.generated_photos.endsWith("]")) {
            photos = JSON.parse(project.generated_photos)
          } else {
            photos = [project.generated_photos]
          }
        } else if (Array.isArray(project.generated_photos)) {
          photos = project.generated_photos
        }
      } catch (e) {
        console.warn("Could not parse photos for project", project.id, e)
        photos = []
      }
    }

    const validPhotos = photos.filter(
      (photo) =>
        photo &&
        typeof photo === "string" &&
        photo.length > 20 &&
        (photo.includes("astria.ai") || photo.includes("mp.astria.ai")) &&
        !photo.includes("example.com") &&
        !photo.includes("placeholder") &&
        !photo.includes("/placeholder.svg"),
    )

    return validPhotos.map((photo: string, index: number) => ({
      url: photo,
      projectName: project.name,
      projectId: project.id,
      index: index,
      key: `${project.id}-${index}`,
    }))
  })

  console.log("Valid photos:", allPhotos.length)

  const handleImageError = (photoKey: string) => {
    console.log("Image error for:", photoKey)
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

  const deletePhoto = async (photo: PhotoItem) => {
    if (!confirm(`Weet je zeker dat je deze foto wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
      return
    }

    setDeletingPhotos((prev) => new Set([...prev, photo.key]))

    try {
      const response = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoUrl: photo.url,
          projectId: photo.projectId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete photo")
      }

      const result = await response.json()

      // Update the projects state to reflect the deletion
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === photo.projectId) {
            let currentPhotos: string[] = []

            if (project.generated_photos) {
              try {
                if (typeof project.generated_photos === "string") {
                  if (project.generated_photos.startsWith("[")) {
                    currentPhotos = JSON.parse(project.generated_photos)
                  } else {
                    currentPhotos = [project.generated_photos]
                  }
                } else if (Array.isArray(project.generated_photos)) {
                  currentPhotos = project.generated_photos
                }
              } catch (e) {
                currentPhotos = []
              }
            }

            const updatedPhotos = currentPhotos.filter((p) => p !== photo.url)

            return {
              ...project,
              generated_photos: JSON.stringify(updatedPhotos),
            }
          }
          return project
        }),
      )

      console.log("Photo deleted successfully")
    } catch (error) {
      console.error("Error deleting photo:", error)
      alert("Er ging iets mis bij het verwijderen van de foto. Probeer het opnieuw.")
    } finally {
      setDeletingPhotos((prev) => {
        const newSet = new Set(prev)
        newSet.delete(photo.key)
        return newSet
      })
    }
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

        {/* Photos Gallery */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Jouw Portetfotos ({allPhotos.length} foto's)</h2>
            {allPhotos.length > 0 && (
              <Button
                onClick={() => setShowDeleteMode(!showDeleteMode)}
                variant={showDeleteMode ? "destructive" : "outline"}
                className="flex items-center gap-2"
              >
                {showDeleteMode ? (
                  <>
                    <X className="h-4 w-4" />
                    Annuleren
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Foto's Verwijderen
                  </>
                )}
              </Button>
            )}
          </div>

          {showDeleteMode && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                ⚠️ Verwijder modus actief - Klik op een foto om deze permanent te verwijderen
              </p>
            </div>
          )}

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
                  <div key={photo.key} className="group relative">
                    <div
                      className={`aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all ${
                        showDeleteMode ? "cursor-pointer hover:ring-2 hover:ring-red-500" : ""
                      } ${deletingPhotos.has(photo.key) ? "opacity-50" : ""}`}
                      onClick={showDeleteMode ? () => deletePhoto(photo) : undefined}
                    >
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

                      {/* Delete overlay */}
                      {showDeleteMode && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <Trash2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}

                      {/* Loading overlay */}
                      {deletingPhotos.has(photo.key) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>

                    {!showDeleteMode && (
                      <Button
                        onClick={() => downloadPhoto(photo.url, photo.projectName, photo.index)}
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={deletingPhotos.has(photo.key)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Success message */}
        {allPhotos.length > 0 && !showDeleteMode && (
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
