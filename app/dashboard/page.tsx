"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/header"
import { Loader2, Download, Trash2, CheckCircle, Circle, User } from "lucide-react"
import JSZip from "jszip"
import { saveAs } from "file-saver"

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
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [bulkDownloading, setBulkDownloading] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects()
      fetchCredits()
    }
  }, [status])

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

  const downloadPhoto = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      saveAs(blob, filename)
    } catch (error) {
      console.error("Error downloading photo:", error)
    }
  }

  const deletePhoto = async (photoUrl: string, projectId: number) => {
    if (!confirm("Weet je zeker dat je deze foto wilt verwijderen?")) {
      return
    }

    try {
      const response = await fetch("/api/photos/delete", {
        method: "POST",
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
        fetchProjects()
      } else {
        console.error("Failed to delete photo")
      }
    } catch (error) {
      console.error("Error deleting photo:", error)
    }
  }

  const togglePhotoSelection = (photoUrl: string) => {
    const newSelected = new Set(selectedPhotos)
    if (newSelected.has(photoUrl)) {
      newSelected.delete(photoUrl)
    } else {
      newSelected.add(photoUrl)
    }
    setSelectedPhotos(newSelected)
  }

  const selectAllPhotos = () => {
    const allPhotos = new Set<string>()
    projects.forEach((project) => {
      if (project.generated_photos) {
        project.generated_photos.forEach((photo) => allPhotos.add(photo))
      }
    })
    setSelectedPhotos(allPhotos)
  }

  const deselectAllPhotos = () => {
    setSelectedPhotos(new Set())
  }

  const bulkDownload = async () => {
    if (selectedPhotos.size === 0) return

    setBulkDownloading(true)
    const zip = new JSZip()

    try {
      const downloadPromises = Array.from(selectedPhotos).map(async (photoUrl, index) => {
        try {
          const response = await fetch(photoUrl)
          const blob = await response.blob()
          const filename = `headshot_${index + 1}.jpg`
          zip.file(filename, blob)
        } catch (error) {
          console.error(`Error downloading ${photoUrl}:`, error)
        }
      })

      await Promise.all(downloadPromises)

      const content = await zip.generateAsync({ type: "blob" })
      saveAs(content, "headshots.zip")

      // Clear selection after download
      setSelectedPhotos(new Set())
    } catch (error) {
      console.error("Error creating zip file:", error)
    } finally {
      setBulkDownloading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p>Please sign in to view your dashboard.</p>
        </div>
      </div>
    )
  }

  const completedProjects = projects.filter((p) => p.status === "completed" && p.generated_photos?.length > 0)
  const allPhotos = completedProjects.flatMap((p) => p.generated_photos || [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Credits Banner */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">Welkom, {session?.user?.name}</h1>
                    <p className="text-gray-600">Je hebt {credits} credits beschikbaar</p>
                  </div>
                </div>
                <Button onClick={() => (window.location.href = "/pricing")} className="bg-blue-600 hover:bg-blue-700">
                  Credits Kopen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions */}
        {allPhotos.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={deleteMode ? "destructive" : "outline"}
                onClick={() => {
                  setDeleteMode(!deleteMode)
                  setSelectedPhotos(new Set())
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteMode ? "Stop Verwijderen" : "Verwijder Modus"}
              </Button>

              {!deleteMode && (
                <>
                  <Button
                    variant="outline"
                    onClick={selectedPhotos.size === allPhotos.length ? deselectAllPhotos : selectAllPhotos}
                  >
                    {selectedPhotos.size === allPhotos.length ? "Deselecteer Alles" : "Selecteer Alles"}
                  </Button>

                  <Button
                    onClick={bulkDownload}
                    disabled={selectedPhotos.size === 0 || bulkDownloading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {bulkDownloading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download Geselecteerd ({selectedPhotos.size})
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="space-y-8">
          {completedProjects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">Nog geen voltooide projecten</h3>
                <p className="text-gray-600 mb-6">Start je eerste AI headshot project om hier je foto's te zien.</p>
                <Button
                  onClick={() => (window.location.href = "/wizard/welcome")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Nieuw Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            completedProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {project.status === "completed" ? "Voltooid" : project.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(project.created_at).toLocaleDateString("nl-NL")}
                        </span>
                        <span className="text-sm text-gray-500">{project.credits_used} credits gebruikt</span>
                      </div>
                    </div>
                  </div>

                  {project.generated_photos && project.generated_photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {project.generated_photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <div
                            className={`relative cursor-pointer transition-all duration-200 ${
                              selectedPhotos.has(photo) ? "ring-4 ring-blue-500" : ""
                            } ${deleteMode ? "hover:ring-4 hover:ring-red-500" : ""}`}
                            onClick={() => {
                              if (deleteMode) {
                                deletePhoto(photo, project.id)
                              } else {
                                togglePhotoSelection(photo)
                              }
                            }}
                          >
                            <img
                              src={photo || "/placeholder.svg"}
                              alt={`Generated headshot ${index + 1}`}
                              className="w-full aspect-[3/4] object-cover rounded-lg"
                            />

                            {deleteMode && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-8 w-8 text-white" />
                              </div>
                            )}

                            {!deleteMode && selectedPhotos.has(photo) && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="h-6 w-6 text-blue-500 bg-white rounded-full" />
                              </div>
                            )}

                            {!deleteMode && !selectedPhotos.has(photo) && (
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Circle className="h-6 w-6 text-white bg-black bg-opacity-50 rounded-full" />
                              </div>
                            )}
                          </div>

                          {!deleteMode && (
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      downloadPhoto(photo, `headshot_${project.name}_${index + 1}.jpg`)
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pending Projects */}
        {projects.filter((p) => p.status !== "completed").length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Projecten in Behandeling</h2>
            <div className="grid gap-6">
              {projects
                .filter((p) => p.status !== "completed")
                .map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{project.name}</h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              {project.status === "pending"
                                ? "In Behandeling"
                                : project.status === "processing"
                                  ? "Wordt Verwerkt"
                                  : project.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(project.created_at).toLocaleDateString("nl-NL")}
                            </span>
                          </div>
                        </div>
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
