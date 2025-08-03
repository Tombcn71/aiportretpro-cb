"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Zap } from "lucide-react"

interface TrainingStatus {
  status: string
  progress: number
  message: string
  estimated_time?: number
}

export default function WizardTrainingPage({ params }: { params: { sessionId: string } }) {
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    status: "starting",
    progress: 0,
    message: "Je AI model wordt voorbereid...",
  })
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/wizard-training/status?sessionId=${params.sessionId}`)
        if (response.ok) {
          const data = await response.json()
          setTrainingStatus(data)

          if (data.status === "completed") {
            setIsComplete(true)
            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              router.push("/dashboard")
            }, 3000)
          }
        }
      } catch (error) {
        console.error("Error checking training status:", error)
      }
    }

    // Check status immediately
    checkStatus()

    // Set up polling every 10 seconds
    const interval = setInterval(checkStatus, 10000)

    return () => clearInterval(interval)
  }, [params.sessionId, session, router])

  const getStatusIcon = () => {
    switch (trainingStatus.status) {
      case "completed":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "training":
        return <Zap className="h-8 w-8 text-blue-500 animate-pulse" />
      default:
        return <Clock className="h-8 w-8 text-orange-500" />
    }
  }

  const getStatusColor = () => {
    switch (trainingStatus.status) {
      case "completed":
        return "bg-green-500"
      case "training":
        return "bg-blue-500"
      default:
        return "bg-orange-500"
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getStatusIcon()}</div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            {isComplete ? "Je AI headshots zijn klaar!" : "Je AI model wordt getraind"}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {isComplete
              ? "Je wordt automatisch doorgestuurd naar je dashboard..."
              : "Dit duurt ongeveer 10-15 minuten. Je hoeft niet te wachten - we sturen je een email wanneer het klaar is."}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Voortgang</span>
              <span>{Math.round(trainingStatus.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getStatusColor()}`}
                style={{ width: `${trainingStatus.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-medium text-gray-900">{trainingStatus.message}</p>
            {trainingStatus.estimated_time && (
              <p className="text-sm text-gray-600 mt-2">
                Geschatte tijd: {Math.round(trainingStatus.estimated_time / 60)} minuten
              </p>
            )}
          </div>

          {/* Training Steps */}
          <div className="space-y-3">
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                trainingStatus.progress >= 25 ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  trainingStatus.progress >= 25 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {trainingStatus.progress >= 25 ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs text-white font-bold">1</span>
                )}
              </div>
              <span className={`${trainingStatus.progress >= 25 ? "text-green-700" : "text-gray-600"}`}>
                Foto's analyseren
              </span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                trainingStatus.progress >= 50 ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  trainingStatus.progress >= 50 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {trainingStatus.progress >= 50 ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs text-white font-bold">2</span>
                )}
              </div>
              <span className={`${trainingStatus.progress >= 50 ? "text-green-700" : "text-gray-600"}`}>
                AI model trainen
              </span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                trainingStatus.progress >= 75 ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  trainingStatus.progress >= 75 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {trainingStatus.progress >= 75 ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs text-white font-bold">3</span>
                )}
              </div>
              <span className={`${trainingStatus.progress >= 75 ? "text-green-700" : "text-gray-600"}`}>
                Headshots genereren
              </span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                trainingStatus.progress >= 100 ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  trainingStatus.progress >= 100 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {trainingStatus.progress >= 100 ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-xs text-white font-bold">4</span>
                )}
              </div>
              <span className={`${trainingStatus.progress >= 100 ? "text-green-700" : "text-gray-600"}`}>
                Klaar voor download
              </span>
            </div>
          </div>

          {isComplete && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Success! Je wordt doorgestuurd naar je dashboard...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
