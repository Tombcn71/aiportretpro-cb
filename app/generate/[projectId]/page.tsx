"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Camera, Sparkles } from "lucide-react"

export default function GeneratePage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Voorbereiden...")
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    const checkProjectStatus = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        const projectData = await response.json()
        setProject(projectData)

        if (projectData.status === "completed") {
          setProgress(100)
          setStatus("Voltooid! Doorsturen naar dashboard...")
          setTimeout(() => router.push("/dashboard"), 1500)
        } else if (projectData.status === "failed") {
          setStatus("Er is een fout opgetreden")
          setProgress(0)
        } else if (projectData.status === "training") {
          setStatus("AI model wordt getraind op jouw foto's...")
          setProgress(Math.min(progress + 2, 40))
        } else if (projectData.status === "processing") {
          setStatus("Professionele portetfotos worden gegenereerd...")
          setProgress(Math.min(progress + 3, 90))
        } else {
          setStatus("Voorbereiden...")
          setProgress(Math.min(progress + 1, 20))
        }
      } catch (error) {
        console.error("Error checking project status:", error)
      }
    }

    // Check status immediately
    checkProjectStatus()

    // Then check every 15 seconds
    const interval = setInterval(checkProjectStatus, 15000)

    return () => {
      clearInterval(interval)
    }
  }, [projectId, router, progress])

  const getStatusIcon = () => {
    if (project?.status === "training") {
      return <Camera className="h-16 w-16 text-[#0077B5] mx-auto mb-4 animate-pulse" />
    } else if (project?.status === "processing") {
      return <Sparkles className="h-16 w-16 text-[#0077B5] mx-auto mb-4 animate-bounce" />
    } else {
      return <Loader2 className="h-16 w-16 text-[#0077B5] mx-auto mb-4 animate-spin" />
    }
  }

  const getEstimatedTime = () => {
    if (project?.status === "training") {
      return "Dit kan 10-15 minuten duren voor de training."
    } else if (project?.status === "processing") {
      return "Nog 5-10 minuten voor alle portetfotos klaar zijn."
    } else {
      return "Dit kan 15-25 minuten duren in totaal."
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-[#0077B5] shadow-xl">
        <CardHeader className="text-center">
          {getStatusIcon()}
          <CardTitle className="text-2xl text-[#0077B5]">AI Portetfotos Genereren</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{status}</span>
              <span className="font-medium text-[#0077B5]">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full h-3" />
          </div>
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p className="font-medium text-[#0077B5]">{getEstimatedTime()}</p>
            <p>Je ontvangt een e-mail wanneer je portetfotos klaar zijn.</p>
            {project && <p className="mt-2 font-medium">Project: {project.name}</p>}
            <div className="bg-blue-50 p-3 rounded-lg mt-4">
              <p className="text-[#0077B5] font-medium">40 professionele portetfotos worden gegenereerd</p>
              <p className="text-xs text-gray-600 mt-1">Portetfotos m/v pack</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
