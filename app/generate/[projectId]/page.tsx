"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Camera, Sparkles, Coffee } from "lucide-react"

export default function GeneratePage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Voorbereiden...")
  const [project, setProject] = useState<any>(null)
  const [coffeeMessage, setCoffeeMessage] = useState(0)

  const coffeeMessages = [
    "☕ Perfect moment voor een kopje koffie!",
    "🍪 Misschien ook een koekje erbij?",
    "📱 Check je Instagram terwijl je wacht",
    "🎵 Zet je favoriete muziek op",
    "🧘 Even ontspannen, de AI werkt hard voor je",
    "📚 Tijd voor een hoofdstuk in je boek",
    "💭 Bedenk alvast waar je je nieuwe foto's gaat gebruiken",
    "🌟 Straks heb je 40 professionele portetfotos!",
  ]

  useEffect(() => {
    // Rotate coffee messages every 8 seconds
    const messageInterval = setInterval(() => {
      setCoffeeMessage((prev) => (prev + 1) % coffeeMessages.length)
    }, 8000)

    return () => clearInterval(messageInterval)
  }, [])

  useEffect(() => {
    const checkProjectStatus = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        const projectData = await response.json()
        setProject(projectData)

        if (projectData.status === "completed") {
          setProgress(100)
          setStatus("🎉 Voltooid! Je foto's zijn klaar!")
          setTimeout(() => router.push("/dashboard"), 2000)
        } else if (projectData.status === "failed") {
          setStatus("❌ Er is een fout opgetreden")
          setProgress(0)
        } else if (projectData.status === "training") {
          setStatus("🤖 AI model wordt getraind op jouw foto's...")
          setProgress(Math.min(progress + 2, 40))
        } else if (projectData.status === "processing") {
          setStatus("✨ Professionele portetfotos worden gegenereerd...")
          setProgress(Math.min(progress + 3, 90))
        } else {
          setStatus("🚀 Voorbereiden...")
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
    if (project?.status === "completed") {
      return <Sparkles className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
    } else if (project?.status === "training") {
      return <Camera className="h-20 w-20 text-[#0077B5] mx-auto mb-4 animate-pulse" />
    } else if (project?.status === "processing") {
      return <Sparkles className="h-20 w-20 text-[#0077B5] mx-auto mb-4 animate-spin" />
    } else {
      return <Loader2 className="h-20 w-20 text-[#0077B5] mx-auto mb-4 animate-spin" />
    }
  }

  const getEstimatedTime = () => {
    if (project?.status === "completed") {
      return "Doorsturen naar je dashboard..."
    } else if (project?.status === "training") {
      return "⏱️ Nog 10-15 minuten voor de training klaar is"
    } else if (project?.status === "processing") {
      return "⏱️ Nog 5-10 minuten voor alle foto's klaar zijn"
    } else {
      return "⏱️ Totale tijd: 15-25 minuten"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-2 border-[#0077B5] shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          {getStatusIcon()}
          <CardTitle className="text-3xl text-[#0077B5] mb-2">AI Portetfotos</CardTitle>
          <p className="text-lg text-gray-600">Worden gegenereerd...</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">{status}</span>
              <span className="font-bold text-[#0077B5] text-lg">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full h-4 bg-gray-200" />
          </div>

          {/* Coffee Animation Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Coffee className="h-12 w-12 text-amber-600 animate-bounce" />
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-amber-800 font-medium text-lg mb-2">{coffeeMessages[coffeeMessage]}</p>
            <p className="text-center text-amber-600 text-sm">De AI werkt hard aan je perfecte portetfotos</p>
          </div>

          <div className="text-center space-y-3">
            <p className="font-medium text-[#0077B5] text-lg">{getEstimatedTime()}</p>
            <p className="text-gray-600">Je ontvangt een e-mail wanneer je portetfotos klaar zijn</p>
            {project && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-bold text-[#0077B5] text-lg">Project: {project.name}</p>
                <p className="text-sm text-gray-600 mt-1">40 professionele portetfotos</p>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="space-y-2">
            <div className={`flex items-center space-x-2 ${progress >= 20 ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-3 h-3 rounded-full ${progress >= 20 ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className="text-sm">Foto's geüpload en geanalyseerd</span>
            </div>
            <div className={`flex items-center space-x-2 ${progress >= 40 ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-3 h-3 rounded-full ${progress >= 40 ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className="text-sm">AI model getraind op jouw gezicht</span>
            </div>
            <div className={`flex items-center space-x-2 ${progress >= 90 ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-3 h-3 rounded-full ${progress >= 90 ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className="text-sm">Professionele foto's gegenereerd</span>
            </div>
            <div className={`flex items-center space-x-2 ${progress >= 100 ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-3 h-3 rounded-full ${progress >= 100 ? "bg-green-500" : "bg-gray-300"}`}></div>
              <span className="text-sm">Klaar voor download!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
