"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"

interface Project {
  id: number
  name: string
  status: string
  generated_photos: string[] | null
  created_at: string
  updated_at: string
}

export default function GeneratePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const resolvedParams = use(params)
  const resolvedSearchParams = use(searchParams)
  
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user came from successful payment
  useEffect(() => {
    if (resolvedSearchParams.session_id) {
      // Clear pending project data since payment was successful
      localStorage.removeItem("pendingProject")
    }
  }, [resolvedSearchParams.session_id])

  const fetchProject = async () => {
    try {
      // Use the new check-status API that fetches photos from Astria
      const response = await fetch(`/api/projects/check-status/${resolvedParams.projectId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch project")
      }
      const data = await response.json()
      
      // Update project state
      setProject({
        id: parseInt(resolvedParams.projectId),
        name: "Project",
        status: data.status,
        generated_photos: data.photos,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      console.log("📊 Project status:", data.status)
      console.log("📊 Project photos:", data.photoCount)

      // For temporary projects, show a different message
      if (resolvedParams.projectId.startsWith("temp_")) {
        console.log("Showing temporary project page")
      }

      // Redirect to dashboard if completed
      if (data.status === "completed") {
        console.log("🎉 Project completed! Redirecting to dashboard...")
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

    // Poll every 5 seconds for faster updates
    const interval = setInterval(fetchProject, 5000)
    return () => clearInterval(interval)
  }, [resolvedParams.projectId])

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Er is een fout opgetreden</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-12 text-center">
            {/* LinkedIn-style Spinner */}
            <div className="mb-8">
              <div className="relative inline-flex">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#0077B5] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#0077B5] rounded-full opacity-20"></div>
                </div>
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">
                {project?.id === "temp" ? "🎉 Betaling Succesvol!" : "🎯 AI Training is bezig!"}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {project?.id === "temp" 
                  ? "Je betaling is verwerkt. We maken nu je project aan en beginnen met de AI training."
                  : "Je professionele portretfoto's worden nu gegenereerd"
                }
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-[#0077B5] bg-opacity-10 rounded-full">
                <svg className="w-4 h-4 text-[#0077B5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-[#0077B5] font-medium">
                  {project?.id === "temp" 
                    ? "Project wordt aangemaakt..."
                    : "Over ongeveer 15 minuten zijn je foto's klaar"
                  }
                </span>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-[#0077B5] rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  {project?.status === "training" ? "AI model wordt getraind op je foto's" : "Foto's worden gegenereerd"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Je wordt automatisch doorgeleid naar je dashboard wanneer de foto's klaar zijn
              </p>
            </div>

            {/* Project Info */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Project: <span className="font-medium text-gray-700">{project?.name}</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Je kunt deze pagina veilig verlaten, we sturen je een bericht wanneer je foto's klaar zijn
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
