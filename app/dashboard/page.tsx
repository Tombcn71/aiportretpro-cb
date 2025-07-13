"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Camera, CreditCard, Clock, CheckCircle, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: number
  name: string
  status: string
  created_at: string
  generated_photos: string[]
}

interface UserCredits {
  credits: number
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [credits, setCredits] = useState<UserCredits>({ credits: 0 })
  const [loading, setLoading] = useState(true)
  const [buyingCredits, setBuyingCredits] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching dashboard data...")

        // Fetch projects and credits in parallel
        const [projectsResponse, creditsResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/credits/balance"),
        ])

        console.log("📊 Projects response status:", projectsResponse.status)
        console.log("💰 Credits response status:", creditsResponse.status)

        if (!projectsResponse.ok || !creditsResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const projectsData = await projectsResponse.json()
        const creditsData = await creditsResponse.json()

        console.log("📊 Projects data:", projectsData)
        console.log("💰 Credits data:", creditsData)

        setProjects(projectsData)
        setCredits(creditsData)
      } catch (error) {
        console.error("❌ Error fetching data:", error)
        // Set default values on error
        setCredits({ credits: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleBuyCredits = async () => {
    setBuyingCredits(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: "professional" }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Er is een fout opgetreden. Probeer het opnieuw.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setBuyingCredits(false)
    }
  }

  // Get all photos from all projects
  const allPhotos = projects.flatMap((project) =>
    (project.generated_photos || []).map((photo) => ({
      url: photo,
      projectName: project.name,
      projectId: project.id,
    })),
  )

  const downloadPhoto = (photoUrl: string, projectName: string, index: number) => {
    const link = document.createElement("a")
    link.href = photoUrl
    link.download = `${projectName}_portretfoto_${index + 1}.jpg`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Voltooid
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Bezig...
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Wachtend
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
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

  console.log("🎨 Rendering dashboard with credits:", credits.credits)

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
                <div className="flex gap-3">
                  {credits.credits > 0 && (
                    <Link href="/use-credit">
                      <Button className="bg-white text-[#0077B5] hover:bg-gray-100 font-semibold">
                        Start Nieuw Project
                      </Button>
                    </Link>
                  )}
                  <Button
                    onClick={handleBuyCredits}
                    disabled={buyingCredits}
                    className="bg-white/20 text-white hover:bg-white/30 font-semibold border border-white/30"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {buyingCredits ? "Laden..." : "Koop Credits"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Overview */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Jouw Projecten</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-sm text-gray-500">{new Date(project.created_at).toLocaleDateString("nl-NL")}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{project.generated_photos?.length || 0} foto's gegenereerd</p>
                      {project.status === "completed" && project.generated_photos?.length > 0 && (
                        <Link href={`/generate/${project.id}`}>
                          <Button size="sm" variant="outline">
                            Bekijk Foto's
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Photos Gallery */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Alle Portetfotos</h2>

          {allPhotos.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-4">Nog geen portetfotos</h3>
              <p className="text-gray-600 mb-8">
                {credits.credits > 0
                  ? "Je hebt tegoed! Start je eerste project."
                  : "Koop tegoed om je eerste professionele portetfotos te maken."}
              </p>
              <div className="flex gap-4 justify-center">
                {credits.credits > 0 && (
                  <Link href="/use-credit">
                    <Button className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-3">
                      Start Nieuw Project
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleBuyCredits}
                  disabled={buyingCredits}
                  variant={credits.credits > 0 ? "outline" : "default"}
                  className={credits.credits > 0 ? "" : "bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-3"}
                >
                  {buyingCredits ? "Laden..." : "Koop Credits"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allPhotos.map((photo, index) => (
                <div key={index} className="group">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow">
                    <Image
                      src={photo.url || "/placeholder.svg"}
                      alt={`Portretfoto ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    onClick={() => downloadPhoto(photo.url, photo.projectName, index)}
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
      </div>
    </div>
  )
}
