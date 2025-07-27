"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, CheckCircle, Circle, X } from "lucide-react"
import JSZip from "jszip"

interface Project {
  id: number
  name: string
  status: string
  generated_photos: string[]
  created_at: string
  credits_used: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [deletingPhotos, setDeletingPhotos] = useState<Set<string>>(new Set())
  const [downloadingBulk, setDownloadingBulk] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchProjects()
    fetchCredits()
  }, [session, status, router])

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

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits/balance")
      if (response.ok) {
        const data = await response.json()
        setCredits(data.balance)
      }
    } catch (error) {
      console.error("Error fetching credits:", error)
    }
  }

  const handleDeletePhoto = async (photoUrl: string, projectId: number) => {
    if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) {
      return
    }

    setDeletingPhotos((prev) => new Set(prev).add(photoUrl))

    try {
      const response = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoUrl,
          projectId,
        }),
      })

      if (response.ok) {
        // Refresh projects to show updated photos
        await fetchProjects()
      } else {
        const error = await response.json()
        console.error("Error deleting photo:", error)
        alert("Er ging iets mis bij het verwijderen van de foto")
      }
    } catch (error) {
      console.error("Error deleting photo:", error)
      alert("Er ging iets mis bij het verwijderen van de foto")
    } finally {
      setDeletingPhotos((prev) => {
        const newSet = new Set(prev)
        newSet.delete(photoUrl)
        return newSet
      })
    }
  }

  const handlePhotoClick = (photoUrl: string, projectId: number) => {
    if (deleteMode) {
      handleDeletePhoto(photoUrl, projectId)
    } else {
      // Toggle selection for bulk download
      setSelectedPhotos((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(photoUrl)) {
          newSet.delete(photoUrl)
        } else {
          newSet.add(photoUrl)
        }
        return newSet
      })
    }
  }

  const toggleSelectAll = () => {
    const allPhotos = projects.flatMap((project) => project.generated_photos?.filter(Boolean) || [])

    if (selectedPhotos.size === allPhotos.length) {
      setSelectedPhotos(new Set())
    } else {
      setSelectedPhotos(new Set(allPhotos))
    }
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      return { blob, filename }
    } catch (error) {
      console.error("Error downloading image:", error)
      return null
    }
  }

  const handleBulkDownload = async () => {
    if (selectedPhotos.size === 0) return

    setDownloadingBulk(true)
    const zip = new JSZip()

    try {
      const downloadPromises = Array.from(selectedPhotos).map(async (photoUrl, index) => {
        const result = await downloadImage(photoUrl, `headshot_${index + 1}.jpg`)
        if (result) {
          zip.file(result.filename, result.blob)
        }
      })

      await Promise.all(downloadPromises)

      const content = await zip.generateAsync({ type: "blob" })
      const url = window.URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = "headshots.zip"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setSelectedPhotos(new Set())
    } catch (error) {
      console.error("Error creating zip:", error)
      alert("Er ging iets mis bij het downloaden")
    } finally {
      setDownloadingBulk(false)
    }
  }

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode)
    setSelectedPhotos(new Set()) // Clear selections when switching modes
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const allPhotos = projects.flatMap((project) => project.generated_photos?.filter(Boolean) || [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Beheer je AI headshot projecten</p>
        </div>

        {/* Credits Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Credits</h3>
                  <p className="text-blue-100">Je hebt {credits} credits beschikbaar</p>
                </div>
                <Button onClick={() => router.push("/pricing")} className="bg-white text-blue-600 hover:bg-gray-100">
                  Credits Kopen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photo Management Controls */}
        {allPhotos.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <Button
              onClick={toggleDeleteMode}
              variant={deleteMode ? "destructive" : "outline"}
              className="flex items-center gap-2"
            >
              {deleteMode ? <X className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
              {deleteMode ? "Stop Verwijderen" : "Foto's Verwijderen"}
            </Button>

            {!deleteMode && (
              <>
                <Button onClick={toggleSelectAll} variant="outline" className="flex items-center gap-2 bg-transparent">
                  {selectedPhotos.size === allPhotos.length ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  {selectedPhotos.size === allPhotos.length ? "Deselecteer Alles" : "Selecteer Alles"}
                </Button>

                {selectedPhotos.size > 0 && (
                  <Button
                    onClick={handleBulkDownload}
                    disabled={downloadingBulk}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4" />
                    {downloadingBulk ? "Downloaden..." : `Download ${selectedPhotos.size} Foto's`}
                  </Button>
                )}
              </>
            )}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid gap-6">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen projecten gevonden</h3>
                <p className="text-gray-600 mb-6">Start je eerste AI headshot project</p>
                <Button onClick={() => router.push("/wizard/welcome")}>Nieuw Project Starten</Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                        {project.status === "completed"
                          ? "Voltooid"
                          : project.status === "processing"
                            ? "Verwerken"
                            : "In behandeling"}
                      </Badge>
                      {project.credits_used > 0 && (
                        <Badge variant="outline">{project.credits_used} credits gebruikt</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Aangemaakt op {new Date(project.created_at).toLocaleDateString("nl-NL")}
                  </p>
                </CardHeader>
                <CardContent>
                  {project.generated_photos && project.generated_photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {project.generated_photos.filter(Boolean).map((photo, index) => (
                        <div key={index} className="relative group">
                          <div
                            className={`relative cursor-pointer transition-all duration-200 ${
                              selectedPhotos.has(photo) && !deleteMode ? "ring-4 ring-blue-500 ring-opacity-50" : ""
                            }`}
                            onClick={() => handlePhotoClick(photo, project.id)}
                          >
                            <img
                              src={photo || "/placeholder.svg"}
                              alt={`Generated headshot ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />

                            {/* Delete Mode Overlay */}
                            {deleteMode && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                {deletingPhotos.has(photo) ? (
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                ) : (
                                  <Trash2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                )}
                              </div>
                            )}

                            {/* Selection Indicator */}
                            {!deleteMode && selectedPhotos.has(photo) && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-6 h-6 text-blue-500 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">
                        {project.status === "completed"
                          ? "Geen foto's beschikbaar"
                          : "Foto's worden nog gegenereerd..."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* New Project Button */}
        <div className="mt-8 text-center">
          <Button onClick={() => router.push("/wizard/welcome")} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Nieuw Project Starten
          </Button>
        </div>
      </div>
    </div>
  )
}
