"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Loader2 } from "lucide-react"

export default function WizardTrainingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const sessionId = params.sessionId as string
  const success = searchParams.get("success")

  const [status, setStatus] = useState<"processing" | "training" | "completed" | "error">("processing")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!success) return

    // Clear wizard data from sessionStorage
    sessionStorage.removeItem("wizardData")

    // Start polling for training status
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/wizard-training/status?sessionId=${sessionId}`)
        const data = await response.json()

        setStatus(data.status)
        setProgress(data.progress || 0)

        if (data.status === "completed") {
          // Redirect to dashboard after completion
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 3000)
        }
      } catch (error) {
        console.error("Error polling status:", error)
        setStatus("error")
      }
    }

    // Poll every 10 seconds
    const interval = setInterval(pollStatus, 10000)
    pollStatus() // Initial call

    return () => clearInterval(interval)
  }, [sessionId, success])

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Je betaling wordt verwerkt..."
      case "training":
        return "Je AI model wordt getraind..."
      case "completed":
        return "Training voltooid! Je wordt doorgestuurd..."
      case "error":
        return "Er is een fout opgetreden. Neem contact op met support."
      default:
        return "Bezig..."
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Clock className="h-12 w-12 text-blue-500" />
      case "training":
        return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-12 w-12 text-green-500" />
      case "error":
        return <div className="h-12 w-12 text-red-500">❌</div>
      default:
        return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">AI Training in Progress</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center">{getStatusIcon()}</div>

          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">{getStatusMessage()}</p>
            <p className="text-sm text-gray-600">Dit kan 10-15 minuten duren</p>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-gray-500">{progress}% voltooid</p>
          </div>

          {status === "training" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Laat dit venster open. Je krijgt automatisch een melding wanneer je headshots
                klaar zijn!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
