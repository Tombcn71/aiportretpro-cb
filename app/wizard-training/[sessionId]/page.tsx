"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Zap, Camera } from "lucide-react"

export default function WizardTrainingPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string

  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("starting")
  const [statusText, setStatusText] = useState("Training wordt gestart...")
  const [timeRemaining, setTimeRemaining] = useState("15 minuten")

  useEffect(() => {
    if (!sessionId) {
      router.push("/dashboard")
      return
    }

    // Simulate training progress
    const steps = [
      { status: "starting", text: "Training wordt gestart...", progress: 5, time: "15 minuten" },
      { status: "uploading", text: "Foto's worden geanalyseerd...", progress: 15, time: "12 minuten" },
      { status: "training", text: "AI model wordt getraind...", progress: 30, time: "10 minuten" },
      { status: "training", text: "Gezichtskenmerken worden geleerd...", progress: 50, time: "8 minuten" },
      { status: "training", text: "Stijlen worden toegepast...", progress: 70, time: "5 minuten" },
      { status: "generating", text: "Headshots worden gegenereerd...", progress: 85, time: "3 minuten" },
      { status: "finalizing", text: "Laatste details worden toegevoegd...", progress: 95, time: "1 minuut" },
      { status: "complete", text: "Klaar! Je headshots zijn beschikbaar.", progress: 100, time: "Nu beschikbaar" },
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep]
        setStatus(step.status)
        setStatusText(step.text)
        setProgress(step.progress)
        setTimeRemaining(step.time)
        currentStep++
      } else {
        clearInterval(interval)
        // Redirect to dashboard after completion
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      }
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [sessionId, router])

  const getStatusIcon = () => {
    switch (status) {
      case "starting":
      case "uploading":
        return <Clock className="w-8 h-8 text-blue-600" />
      case "training":
        return <Zap className="w-8 h-8 text-orange-600 animate-pulse" />
      case "generating":
        return <Camera className="w-8 h-8 text-purple-600" />
      case "complete":
        return <CheckCircle className="w-8 h-8 text-green-600" />
      default:
        return <Clock className="w-8 h-8 text-blue-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "starting":
      case "uploading":
        return "bg-blue-500"
      case "training":
        return "bg-orange-500"
      case "generating":
        return "bg-purple-500"
      case "complete":
        return "bg-green-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              {getStatusIcon()}
            </div>
            <h1 className="text-3xl font-bold mb-4">Je AI Headshots worden gemaakt</h1>
            <p className="text-xl text-gray-600 mb-2">{statusText}</p>
            <p className="text-lg text-gray-500">Geschatte tijd: {timeRemaining}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Voortgang</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getStatusColor()}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-medium">Foto's geüpload</span>
                </div>
                <p className="text-sm text-gray-600">Je foto's zijn succesvol verwerkt</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  {progress >= 30 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <span className="font-medium">AI Training</span>
                </div>
                <p className="text-sm text-gray-600">
                  {progress >= 30 ? "Model is getraind" : "Model wordt getraind..."}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  {progress >= 85 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <span className="font-medium">Headshots genereren</span>
                </div>
                <p className="text-sm text-gray-600">
                  {progress >= 85 ? "40 headshots gegenereerd" : "Headshots worden gemaakt..."}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  {progress >= 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <span className="font-medium">Klaar voor download</span>
                </div>
                <p className="text-sm text-gray-600">
                  {progress >= 100 ? "Beschikbaar in je dashboard" : "Bijna klaar..."}
                </p>
              </div>
            </div>

            {progress >= 100 && (
              <div className="text-center mt-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium">🎉 Gefeliciteerd! Je professionele headshots zijn klaar.</p>
                  <p className="text-green-700 text-sm mt-1">Je wordt automatisch doorgestuurd naar je dashboard...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>💡 Tip: Je kunt dit venster sluiten. We sturen je een email wanneer je headshots klaar zijn.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
