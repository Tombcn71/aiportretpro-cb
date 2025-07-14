"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Trash2, CreditCard } from "lucide-react"
import { Header } from "@/components/header"

interface Photo {
  id: string
  url: string
  project_name?: string
}

interface Project {
  id: number
  name: string
  status: string
  generated_photos: string[]
  created_at: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deleteMode, setDeleteMode] = useState(false)
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      redirect("/login")
    }
    fetchData()
  }, [session, status])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch credits
      const creditsResponse = await fetch("/api/credits/balance")
      if (creditsResponse.ok) {
        const creditsData = await creditsResponse.json()
        setCredits(creditsData.balance || 0)
      }

      // Fetch all photos from all projects
      const projectsResponse = await fetch("/api/projects")
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()

        // Extract all photos from all projects
        const allPhotos: Photo[] = []
        projectsData.forEach((project: Project) => {
          if (project.generated_photos && Array.isArray(project.generated_photos)) {
            project.generated_photos.forEach((photoUrl: string, index: number) => {
              if (photoUrl && photoUrl.includes("astria.ai")) {
                allPhotos.push({
                  id: `${project.id}-${index}`,
                  url: photoUrl,
                  project_name: project.name,
                })
              }
            })
          }
        })

        // Remove duplicates based on URL
        const uniquePhotos = allPhotos.filter(
          (photo, index, self) => index === self.findIndex((p) => p.url === photo.url),
        )

        setPhotos(uniquePhotos)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePhoto = async (photoId: string, photoUrl: string) => {
    if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) {
      return
    }

    setDeletingPhoto(photoId)

    try {
      const response = await fetch("/api/photos/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoUrl }),
      })

      if (response.ok) {
        // Remove photo from local state
        setPhotos(photos.filter((photo) => photo.id !== photoId))
      } else {
        alert("Er ging iets mis bij het verwijderen van de foto")
      }
    } catch (error) {
      console.error("Error deleting photo:", error)
      alert("Er ging iets mis bij het verwijderen van de foto")
    } finally {
      setDeletingPhoto(null)
    }
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
      console.error("Download failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B5] mx-auto"></div>
            <p className="mt-4 text-gray-600">Dashboard laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Credits Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Jouw Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#0077B5]">{credits}</p>
                  <p className="text-gray-600">Credits beschikbaar</p>
                </div>
                <Button asChild>
                  <a href="/pricing">Credits Kopen</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photos Gallery */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Jouw Portetfotos</h2>
            <Button
              onClick={() => setDeleteMode(!deleteMode)}
              variant={deleteMode ? "destructive" : "outline"}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleteMode ? "Annuleren" : "Foto's Verwijderen"}
            </Button>
          </div>

          {photos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 mb-4">Je hebt nog geen foto's gegenereerd.</p>
                <Button asChild>
                  <a href="/pricing">Start je eerste fotoshoot</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow">
                    <Image
                      src={photo.url || "/placeholder.svg"}
                      alt="Generated portrait"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                  </div>

                  {/* Action buttons */}
                  <div
                    className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 transition-opacity ${
                      deleteMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {deleteMode ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePhoto(photo.id, photo.url)}
                        disabled={deletingPhoto === photo.id}
                        className="text-xs"
                      >
                        {deletingPhoto === photo.id ? "Verwijderen..." : "Verwijder"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => downloadPhoto(photo.url, `portrait-${photo.id}.jpg`)}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
