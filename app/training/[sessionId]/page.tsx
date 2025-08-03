"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Zap, ArrowRight } from "lucide-react"

export default function TrainingPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const [status, setStatus] = useState<"processing" | "training" | "completed" | "error">("processing")
  const [progress, setProgress] = useState(0)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [estimatedTime, setEstimatedTime] = useState(15)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/training/status?sessionId=${sessionId}`)
        const data = await response.json()

        if (data.status) {
          setStatus(data.status)
          setProgress(data.progress || 0)
          setProjectId(data.projectId)
          setEstimatedTime(data.estimatedTime || 15)

          if (data.status === "completed") {
            clearInterval(interval)
            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              router.push("/dashboard")
            }, 3000)
          } else if (data.status === "error") {
            clearInterval(interval)
          }
        }
      } catch (error) {
        console.error("Status check error:", error)
      }
    }

    // Check immediately
    checkStatus()

    // Then check every 10 seconds
    interval = setInterval(checkStatus, 10000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionId, router])

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Betaling verwerkt, training wordt voorbereid..."
      case "training":
        return "AI model wordt getraind met jouw foto's..."
      case "completed":
        return "Training voltooid! Je foto's zijn klaar."
      case "error":
        return "Er is een fout opgetreden tijdens de training."
      default:
        return "Status wordt geladen..."
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
      case "error":
        return 0
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Training in Progress</h1>
          <p className="text-gray-600">Je professionele headshots worden gegenereerd</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === "completed" ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : status === "error" ? (
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-red-600"></div>
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse"></div>
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

            {status === "training" && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Geschatte resterende tijd: {estimatedTime} minuten
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Onze AI analyseert je foto's en creëert professionele headshots in verschillende stijlen.
                </p>
              </div>
            )}

            {status === "completed" && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Training voltooid!</span>
                </div>
                <p className="text-sm text-green-700 mb-4">
                  Je professionele headshots zijn klaar en beschikbaar in je dashboard.
                </p>
                <Button onClick={() => router.push("/dashboard")} className="w-full bg-green-600 hover:bg-green-700">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Bekijk je foto's
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-4 rounded-full bg-red-600"></div>
                  <span className="text-sm font-medium text-red-800">Training mislukt</span>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  Er is een fout opgetreden tijdens het trainen van je AI model. Neem contact op met support.
                </p>
                <Button
                  onClick={() => router.push("/contact")}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  Contact Support
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">AI Powered</h3>
              <p className="text-sm text-gray-600">Geavanceerde AI technologie</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Snel</h3>
              <p className="text-sm text-gray-600">Klaar binnen 15 minuten</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Professioneel</h3>
              <p className="text-sm text-gray-600">40 HD kwaliteit foto's</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
