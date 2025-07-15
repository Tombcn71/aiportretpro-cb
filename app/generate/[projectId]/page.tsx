"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: number
  name: string
  status: string
  generated_photos: string[] | null
  created_at: string
  updated_at: string
}

const waitingMessages = [
  "☕ Tijd voor een lekker kopje koffie!",
  "🎨 Je AI kunstenaar is hard aan het werk...",
  "✨ Perfecte headshots worden gemaakt...",
  "🚀 Bijna klaar met je professionele foto's!",
  "💼 Bereid je voor op geweldige resultaten!",
  "🎯 Kwaliteit kost tijd, maar het is het waard!",
]

export default function GeneratePage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messageIndex, setMessageIndex] = useState(0)
  const router = useRouter()

  // Rotate messages every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % waitingMessages.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch project")
      }
      const data = await response.json()
      setProject(data)

      // Redirect to dashboard if completed
      if (data.status === "completed") {
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProject()

    // Poll every 15 seconds
    const interval = setInterval(fetchProject, 15000)
    return () => clearInterval(interval)
  }, [params.projectId])

  const getProgress = () => {
    if (!project) return 0

    switch (project.status) {
      case "created":
        return 10
      case "training":
        return 30
      case "processing":
        return 70
      case "completed":
        return 100
      default:
        return 0
    }
  }

  const getStatusText = () => {
    if (!project) return "Laden..."

    switch (project.status) {
      case "created":
        return "Project aangemaakt"
      case "training":
        return "AI model wordt getraind (10-15 min)"
      case "processing":
        return "Foto's worden gegenereerd (5-10 min)"
      case "completed":
        return "Klaar! Doorsturen naar dashboard..."
      default:
        return project.status
    }
  }

  const getTimeEstimate = () => {
    if (!project) return ""

    switch (project.status) {
      case "training":
        return "Nog ongeveer 10-15 minuten"
      case "processing":
        return "Nog ongeveer 5-10 minuten"
      case "completed":
        return "Klaar!"
      default:
        return ""
    }
  }

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 text-xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Oeps!</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          {/* Coffee Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="text-6xl mb-4">☕</div>
              {/* Steam Animation */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-1 h-6 bg-gray-300 rounded-full opacity-60 animate-pulse"></div>
                  <div
                    className="w-1 h-8 bg-gray-400 rounded-full opacity-40 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="w-1 h-6 bg-gray-300 rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{project?.name || "Je Fotoshoot"}</h1>
            <p className="text-lg text-blue-600 font-medium mb-4">{waitingMessages[messageIndex]}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
              <span className="text-sm text-gray-500">{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="h-3" />
            <p className="text-sm text-gray-500 mt-2 text-center">{getTimeEstimate()}</p>
          </div>

          {/* Status Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div
              className={`text-center p-4 rounded-lg ${
                ["created", "training", "processing", "completed"].includes(project?.status || "")
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium">Project Gestart</div>
            </div>

            <div
              className={`text-center p-4 rounded-lg ${
                ["training", "processing", "completed"].includes(project?.status || "")
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-medium">AI Training</div>
            </div>

            <div
              className={`text-center p-4 rounded-lg ${
                ["processing", "completed"].includes(project?.status || "")
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <div className="text-2xl mb-2">📸</div>
              <div className="font-medium">Foto's Genereren</div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800">
              <strong>Wist je dat:</strong> Je AI model leert van je foto's om perfecte headshots te maken die er
              precies uitzien zoals jij! 🎨
            </p>
          </div>

          {/* Photo Count */}
          {project?.generated_photos && project.generated_photos.length > 0 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                <span className="text-sm font-medium">📸 {project.generated_photos.length} foto's ontvangen</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
