"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WizardTrainingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const sessionId = params.sessionId as string
  const stripeSessionId = searchParams.get("session_id")

  const [status, setStatus] = useState<"processing" | "training" | "completed" | "failed">("processing")
  const [progress, setProgress] = useState(0)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/wizard-training/status?sessionId=${sessionId}&stripeSessionId=${stripeSessionId}`,
        )
        if (response.ok) {
          const data = await response.json()
          setStatus(data.status)
          setProgress(data.progress || 0)
          setProjectId(data.projectId)

          if (data.status === "completed") {
            clearInterval(interval)
            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              window.location.href = "/dashboard"
            }, 3000)
          } else if (data.status === "failed") {
            clearInterval(interval)
          }
        }
      } catch (error) {
        console.error("Status check failed:", error)
      }
    }

    // Initial check
    checkStatus()

    // Set up polling every 10 seconds
    interval = setInterval(checkStatus, 10000)

    // Time counter
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [sessionId, stripeSessionId])

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Betaling verwerken..."
      case "training":
        return "AI model trainen..."
      case "completed":
        return "Training voltooid!"
      case "failed":
        return "Er is een fout opgetreden"
      default:
        return "Bezig..."
    }
  }

  const getProgressValue = () => {
    switch (status) {
      case "processing":
        return 10
      case "training":
        return Math.min(progress, 90)
      case "completed":
        return 100
      case "failed":
        return 0
      default:
        return 0
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Training in Progress</h1>
          <p className="text-gray-600">We zijn je professionele portretfoto's aan het genereren</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === "completed" ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : status === "failed" ? (
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
              )}
              {getStatusMessage()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Voortgang</span>
                <span>{getProgressValue()}%</span>
              </div>
              <Progress value={getProgressValue()} className="h-3" />
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Verstreken tijd: {formatTime(timeElapsed)}</span>
              </div>
              {status === "training" && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Zap className="h-4 w-4" />
                  <span>Geschatte tijd: ~15 min</span>
                </div>
              )}
            </div>

            {status === "completed" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Training voltooid!</span>
                </div>
                <p className="text-green-700 text-sm mb-3">
                  Je professionele portretfoto's zijn klaar. Je wordt automatisch doorgestuurd naar je dashboard.
                </p>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Ga naar Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {status === "failed" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                    <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                  </div>
                  <span className="font-semibold">Training mislukt</span>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  Er is een fout opgetreden tijdens het trainen van je AI model. Neem contact op met support.
                </p>
                <Button
                  onClick={() => (window.location.href = "/contact")}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  Contact Support
                </Button>
              </div>
            )}

            {(status === "processing" || status === "training") && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-800 text-sm">
                  <p className="mb-2">
                    <strong>Wat gebeurt er nu?</strong>
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Je betaling wordt verwerkt</li>
                    <li>• AI model wordt getraind met je foto's</li>
                    <li>• 40 professionele portretfoto's worden gegenereerd</li>
                    <li>• Resultaten worden klaargezet in je dashboard</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>Sluit deze pagina niet af tijdens het training proces</p>
        </div>
      </div>
    </div>
  )
}
