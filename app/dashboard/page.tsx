"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, MoreVertical, Trash2, User, CreditCard, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"

interface Project {
  id: number
  name: string
  status: string
  created_at: string
  generated_photos: string[]
  photo_count: number
}

interface Credits {
  balance: number
  total_purchased: number
  total_used: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [credits, setCredits] = useState<Credits | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchProjects()
      fetchCredits()
    }
  }, [status, router])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits/balance")
      if (response.ok) {
        const data = await response.json()
        setCredits(data)
      }
    } catch (error) {
      console.error("Error fetching credits:", error)
    }
  }

  const deleteProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== projectId))
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const downloadPhoto = async (photoUrl: string, filename: string) => {
    try {
      const response = await fetch(photoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading photo:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Voltooid</Badge>
      case "training":
        return <Badge className="bg-blue-100 text-blue-800">Training</Badge>
      case "generating":
        return <Badge className="bg-yellow-100 text-yellow-800">Genereren</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Fout</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Dashboard laden...</p>
        </div>
      </div>
    )
  }

  const completedProjects = projects.filter((p) => p.status === "completed")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Image src="/images/logo-icon.png" alt="Logo" width={32} height={32} />
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {credits && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{credits.balance}</span> credits
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => router.push("/pricing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Credits kopen</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Uitloggen</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Credits Overview */}
        {credits && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Credits Overzicht</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{credits.balance}</div>
                  <div className="text-sm text-gray-600">Beschikbaar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{credits.total_purchased}</div>
                  <div className="text-sm text-gray-600">Gekocht</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{credits.total_used}</div>
                  <div className="text-sm text-gray-600">Gebruikt</div>
                </div>
              </div>
              {credits.balance === 0 && (
                <div className="mt-4 text-center">
                  <Button onClick={() => router.push("/pricing")} className="bg-blue-600 hover:bg-blue-700">
                    Credits kopen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Photo Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Jouw AI Headshots</CardTitle>
          </CardHeader>
          <CardContent>
            {completedProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <User className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nog geen headshots</h3>
                <p className="text-gray-600 mb-6">
                  Start je eerste fotoshoot om professionele AI headshots te krijgen.
                </p>
                <Button onClick={() => router.push("/wizard/welcome")} className="bg-blue-600 hover:bg-blue-700">
                  Start fotoshoot
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {completedProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          {getStatusBadge(project.status)}
                          <span className="text-sm text-gray-500">
                            {new Date(project.created_at).toLocaleDateString("nl-NL")}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => deleteProject(project.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {project.generated_photos && project.generated_photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {project.generated_photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={photo || "/placeholder.svg"}
                              alt={`Generated photo ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => downloadPhoto(photo, `${project.name}-${index + 1}.jpg`)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
