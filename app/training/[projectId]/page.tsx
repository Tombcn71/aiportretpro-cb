"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Zap, Camera } from "lucide-react"

interface Project {
  id: number
  name: string
  status: string
  created_at: string
  generated_photos: string | null
}

export default function TrainingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState("Initializing...")

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    // Fetch project status
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (response.ok) {
          const projectData = await response.json()
          setProject(projectData)

          // Update progress based on status
          switch (projectData.status) {
            case "training":
              setProgress(25)
              setStatusText("AI model wordt getraind...")
              break
            case "trained":
              setProgress(50)
              setStatusText("Training voltooid, foto's worden gegenereerd...")
              break
            case "generating":
              setProgress(75)
              setStatusText("Professionele headshots worden gemaakt...")
              break
            case "completed":
              setProgress(100)
              setStatusText("Klaar! Je foto's zijn beschikbaar.")
              setTimeout(() => router.push("/dashboard"), 2000)
              break
            default:
              setProgress(10)
              setStatusText("Project wordt voorbereid...")
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error)
      }
    }

    fetchProject()

    // Poll every 10 seconds if not completed
    const interval = setInterval(() => {
      if (project?.status !== "completed") {
        fetchProject()
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [session, status, router, projectId, project?.status])

  if (status === "loading" || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {progress < 30 ? (
                <Zap className="w-8 h-8 text-blue-600" />
              ) : progress < 80 ? (
                <Clock className="w-8 h-8 text-blue-600" />
              ) : progress < 100 ? (
                <Camera className="w-8 h-8 text-blue-600" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">AI Training in Progress</h1>
            <p className="text-gray-600">{statusText}</p>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-gray-500">{progress}% complete</p>
          </div>

          <div className="mt-8 space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Payment processed successfully</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Photos uploaded and validated</span>
            </div>
            <div className="flex items-center">
              {progress >= 25 ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span>AI model training</span>
            </div>
            <div className="flex items-center">
              {progress >= 75 ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span>Generating headshots</span>
            </div>
            <div className="flex items-center">
              {progress >= 100 ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span>Ready for download</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            Dit duurt meestal 10-15 minuten. Je wordt automatisch doorgestuurd.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
