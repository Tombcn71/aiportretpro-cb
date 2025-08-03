"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Zap, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WizardTrainingPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const [status, setStatus] = useState("training")
  const [progress, setProgress] = useState(0)
  const [projectId, setProjectId] = useState<number | null>(null)

  useEffect(() => {
    if (!sessionId) return

    let progressInterval: NodeJS.Timeout
    let statusInterval: NodeJS.Timeout

    // Simulate realistic training progress
    const startProgress = () => {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setStatus("completed")
            return 100
          }
          // Realistic progress: slower at start, faster in middle, slower at end
          if (prev < 20) return prev + Math.random() * 2
          if (prev < 80) return prev + Math.random() * 5
          return prev + Math.random() * 1
        })
      }, 2000)
    }

    // Check actual status from database
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/wizard-training/status?sessionId=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.projectId) {
            setProjectId(data.projectId)
          }
          if (data.status === "completed") {
            setStatus("completed")
            setProgress(100)
            clearInterval(progressInterval)
            clearInterval(statusInterval)
          }
        }
      } catch (error) {
        console.error("Status check failed:", error)
      }
    }

    startProgress()
    checkStatus()

    // Check status every 30 seconds
    statusInterval = setInterval(checkStatus, 30000)

    // Auto redirect after completion
    if (status === "completed") {
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval)
      if (statusInterval) clearInterval(statusInterval)
    }
  }, [sessionId, router, status])

  const getStatusMessage = () => {
    if (status === "training") {
      if (progress < 20) return "AI model wordt getraind met je foto's..."
      if (progress < 40) return "Gezichtskenmerken worden geanalyseerd..."
      if (progress < 60) return "Professionele outfits worden gegenereerd..."
      if (progress < 80) return "Verschillende poses worden gecreëerd..."
      if (progress < 95) return "Laatste details worden toegevoegd..."
      return "Bijna klaar! Foto's worden geoptimaliseerd..."
    }
    return "Training voltooid! Je professionele headshots zijn klaar."
  }

  const getStatusIcon = () => {
    if (status === "completed") {
      return <CheckCircle className="h-8 w-8 text-green-600" />
    }
    return <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Training in Progress</h1>
          <p className="text-gray-600">Je professionele portretfoto's worden gegenereerd</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getStatusIcon()}
              <span>{status === "completed" ? "Training Voltooid!" : "Training Bezig..."}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Voortgang</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">{getStatusMessage()}</p>
              {status === "training" && (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Clock className="h-5 w-5" />
                  <span>Geschatte tijd: 10-15 minuten</span>
                </div>
              )}
            </div>

            {status === "completed" && (
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Je foto's zijn klaar!</h3>
                <p className="text-green-700 mb-4">
                  40 professionele headshots zijn succesvol gegenereerd en klaar voor download.
                </p>
                <Button onClick={() => router.push("/dashboard")} className="bg-green-600 hover:bg-green-700">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Bekijk je foto's
                </Button>
                <p className="text-sm text-green-600 mt-2">Je wordt automatisch doorgestuurd...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Snelle AI</h3>
              <p className="text-sm text-gray-600">Geavanceerde AI technologie</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">40 Foto's</h3>
              <p className="text-sm text-gray-600">Verschillende poses & outfits</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">HD Kwaliteit</h3>
              <p className="text-sm text-gray-600">Professionele resultaten</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
