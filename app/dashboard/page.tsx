"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"

interface Photo {
  id: string
  url: string
  project_name?: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deleteMode, setDeleteMode] = useState(false)
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status])

  useEffect(() => {
    if (session?.user?.email) {
      fetchPhotos()
      fetchCredits()
    }
  }, [session])

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()

        // Extract all photos from all projects
        const allPhotos: Photo[] = []
        data.projects.forEach((project: any) => {
          if (project.generated_photos && Array.isArray(project.generated_photos)) {
            project.generated_photos.forEach((photoUrl: string, index: number) => {
              if (photoUrl && photoUrl.includes("astria.ai")) {
                allPhotos.push({
                  id: `${project.id}-${index}`,
                  url: photoUrl,
                  project_name: project.project_name,
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
      console.error("Error fetching photos:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits/balance")
      if (response.ok) {
        const data = await response.json()
        setCredits(data.credits || 0)
      }
    } catch (error) {
      console.error("Error fetching credits:", error)
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
      console.error("Error downloading photo:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B5] mx-auto mb-4"></div>
              <p className="text-gray-600">Dashboard laden...</p>
            </div>
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
              <CardTitle className="flex items-center justify-between">
                <span>Jouw Credits</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {credits} credits
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {credits > 0
                  ? `Je hebt nog ${credits} credits beschikbaar voor nieuwe portretten.`
                  : "Je hebt geen credits meer. Koop nieuwe credits om meer portretten te maken."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Photos Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Jouw Portetfotos</h2>
            {photos.length > 0 && (
              <Button
                onClick={() => setDeleteMode(!deleteMode)}
                variant={deleteMode ? "destructive" : "outline"}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {deleteMode ? "Annuleren" : "Foto's Verwijderen"}
              </Button>
            )}
          </div>

          {photos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen foto's gevonden</h3>
                <p className="text-gray-600 mb-4">Je hebt nog geen portretten gemaakt. Start je eerste fotoshoot!</p>
                <Button asChild className="bg-[#0077B5] hover:bg-[#005885]">
                  <a href="/pricing">Maak je eerste portretten</a>
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
                      alt="AI Portret"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=400&width=300&text=Foto+niet+beschikbaar"
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
                        onClick={() => handleDeletePhoto(photo.id, photo.url)}
                        disabled={deletingPhoto === photo.id}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingPhoto === photo.id ? "Verwijderen..." : "Verwijder"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => downloadPhoto(photo.url, `portret-${photo.id}.jpg`)}
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
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
