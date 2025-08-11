"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Camera, Trash2, X, CheckCircle, DownloadIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import JSZip from "jszip"

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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [credits, setCredits] = useState<UserCredits>({ credits: 0 })
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [deletingPhotos, setDeletingPhotos] = useState<Set<string>>(new Set())
  const [showDeleteMode, setShowDeleteMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [bulkDownloading, setBulkDownloading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Don't render if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  useEffect(() => {
    if (status !== "authenticated") return

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
  }, [status])

  // Parse generated photos and filter out invalid ones - ONLY COUNT UNIQUE PHOTOS
  const allPhotos = projects.flatMap((project) => {
    let photos: string[] = []

    if (project.generated_photos) {
      try {
        if (typeof project.generated_photos === "string") {
          if (project.generated_photos.startsWith("[") && project.generated_photos.endsWith("]")) {
            photos = JSON.parse(project.generated_photos)
          } else if (project.generated_photos.includes("astria.ai")) {
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

    // Filter for valid Astria photos only
    const validPhotos = photos.filter(
      (photo) =>
        photo &&
        typeof photo === "string" &&
        photo.length > 20 &&
        (photo.includes("astria.ai") || photo.includes("mp.astria.ai")) &&
        !photo.includes("example.com") &&
        !photo.includes("placeholder") &&
        !photo.includes("/placeholder.svg") &&
        !photo.includes("null") &&
        photo.startsWith("http"),
    )

    return validPhotos.map((photo: string, index: number) => ({
      url: photo,
      projectName: project.name,
      projectId: project.id,
      index: index,
      key: `${project.id}-${photo.substring(photo.lastIndexOf("/") + 1)}`,
    }))
  })

  // Remove duplicates based on URL - THIS IS THE KEY FIX
  const uniquePhotos = allPhotos.filter((photo, index, self) => index === self.findIndex((p) => p.url === photo.url))

  console.log("Total photos found:", allPhotos.length, "Unique photos:", uniquePhotos.length)

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
              generated_photos: updatedPhotos,
            }
          }
          return project
        }),
      )

      // Remove from selected photos if it was selected
      setSelectedPhotos((prev) => {
        const newSet = new Set(prev)
        newSet.delete(photo.key)
        return newSet
      })

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

  const togglePhotoSelection = (photoKey: string) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(photoKey)) {
        newSet.delete(photoKey)
      } else {
        newSet.add(photoKey)
      }
      return newSet
    })
  }

  const selectAllPhotos = () => {
    const validPhotoKeys = uniquePhotos.filter((photo) => !imageErrors.has(photo.key)).map((photo) => photo.key)
    setSelectedPhotos(new Set(validPhotoKeys))
  }

  const deselectAllPhotos = () => {
    setSelectedPhotos(new Set())
  }

  const bulkDownloadPhotos = async () => {
    if (selectedPhotos.size === 0) return

    setBulkDownloading(true)
    const zip = new JSZip()

    try {
      const selectedPhotoItems = uniquePhotos.filter((photo) => selectedPhotos.has(photo.key))

      for (const photo of selectedPhotoItems) {
        try {
          const response = await fetch(photo.url)
          const blob = await response.blob()
          const filename = `${photo.projectName}_portretfoto_${photo.index + 1}.jpg`
          zip.file(filename, blob)
        } catch (error) {
          console.error(`Failed to download ${photo.url}:`, error)
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(zipBlob)
      link.download = `portretfotos_${new Date().toISOString().split("T")[0]}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      // Clear selection after download
      setSelectedPhotos(new Set())
    } catch (error) {
      console.error("Error creating zip file:", error)
      alert("Er ging iets mis bij het maken van het zip bestand.")
    } finally {
      setBulkDownloading(false)
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

  const validPhotos = uniquePhotos.filter((photo) => !imageErrors.has(photo.key))

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

        {/* Credits Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-[#0077B5] to-[#004182] text-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold">{credits.credits}</p>
                  <p className="text-blue-100">Credits</p>
                </div>
                <div className="w-full sm:w-auto">
                  {credits.credits > 0 ? (
                    <Link href="/use-credit" className="block">
                      <Button className="bg-white text-[#0077B5] hover:bg-gray-100 font-semibold w-full sm:w-auto">
                        Start Nieuw Project
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/pricing" className="block">
                      <Button className="bg-white text-[#0077B5] hover:bg-gray-100 font-semibold w-full sm:w-auto">
                        Koop Tegoed
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photos Gallery */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold">Jouw Portetfotos</h2>
            {validPhotos.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {/* Bulk Download Controls */}
                {!showDeleteMode && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Button
                      onClick={selectedPhotos.size === validPhotos.length ? deselectAllPhotos : selectAllPhotos}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto bg-transparent"
                    >
                      {selectedPhotos.size === validPhotos.length ? "Deselecteer Alles" : "Selecteer Alles"}
                    </Button>
                    {selectedPhotos.size > 0 && (
                      <Button
                        onClick={bulkDownloadPhotos}
                        disabled={bulkDownloading}
                        className="bg-[#0077B5] hover:bg-[#004182] text-white w-full sm:w-auto"
                        size="sm"
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        {bulkDownloading ? "Downloaden..." : `Download ${selectedPhotos.size} foto's`}
                      </Button>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => {
                    setShowDeleteMode(!showDeleteMode)
                    setSelectedPhotos(new Set()) // Clear selection when toggling modes
                  }}
                  variant={showDeleteMode ? "destructive" : "outline"}
                  className="flex items-center gap-2 w-full sm:w-auto"
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
              </div>
            )}
          </div>

          {showDeleteMode && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                ⚠️ Verwijder modus actief - Klik op een foto om deze permanent te verwijderen
              </p>
            </div>
          )}

          {validPhotos.length === 0 ? (
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
              {validPhotos.map((photo) => (
                <div key={photo.key} className="group relative">
                  <div
                    className={`aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all ${
                      showDeleteMode ? "cursor-pointer hover:ring-2 hover:ring-red-500" : ""
                    } ${deletingPhotos.has(photo.key) ? "opacity-50" : ""} ${
                      !showDeleteMode && selectedPhotos.has(photo.key) ? "ring-2 ring-[#0077B5]" : ""
                    }`}
                    onClick={showDeleteMode ? () => deletePhoto(photo) : () => togglePhotoSelection(photo.key)}
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

                    {/* Selection indicator */}
                    {!showDeleteMode && selectedPhotos.has(photo.key) && (
                      <div className="absolute top-2 right-2 bg-[#0077B5] text-white rounded-full p-1">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}

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
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadPhoto(photo.url, photo.projectName, photo.index)
                      }}
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
        {validPhotos.length > 0 && !showDeleteMode && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">
                Geweldig! Je hebt {validPhotos.length} professionele portetfotos klaar voor download.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
