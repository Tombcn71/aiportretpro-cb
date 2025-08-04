"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Sparkles, Clock, CheckCircle, Camera, Mail } from "lucide-react"

export default function ProcessingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [projectStatus, setProjectStatus] = useState("payment_completed")
  const [estimatedTime, setEstimatedTime] = useState(20)

  const steps = [
    { name: "Betaling verwerkt", icon: CheckCircle, completed: true },
    { name: "AI-model voorbereiden", icon: Sparkles, completed: false },
    { name: "Foto's analyseren", icon: Camera, completed: false },
    { name: "Headshots genereren", icon: Sparkles, completed: false },
    { name: "Klaar!", icon: Mail, completed: false },
  ]

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 12000) // 20 minutes = 1200 seconds, so 12 seconds per percent

    // Update steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          return steps.length - 1
        }
        return prev + 1
      })
    }, 300000) // 5 minutes per step

    // Check project status periodically
    const statusInterval = setInterval(async () => {
      try {
        const sessionId = searchParams.get("session_id")
        if (sessionId) {
          const response = await fetch(`/api/projects/status?session_id=${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            setProjectStatus(data.status)

            if (data.status === "completed") {
              clearInterval(statusInterval)
              router.push("/dashboard")
            }
          }
        }
      } catch (error) {
        console.error("Error checking status:", error)
      }
    }, 30000) // Check every 30 seconds

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
      clearInterval(statusInterval)
    }
  }, [session, status, router, searchParams])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-orange-600 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Je AI Headshots Worden Gemaakt!</CardTitle>
            <p className="text-gray-600">Onze AI werkt hard aan je professionele headshots</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Voortgang</span>
                <span className="text-gray-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Time Estimate */}
            <div className="flex items-center justify-center space-x-2 text-orange-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Geschatte tijd: {estimatedTime} minuten</span>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Proces Stappen:</h3>
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep || step.completed

                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      isActive
                        ? "bg-orange-50 border border-orange-200"
                        : isCompleted
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? "bg-green-500" : isActive ? "bg-orange-500" : "bg-gray-300"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isCompleted || isActive ? "text-white" : "text-gray-600"}`} />
                    </div>
                    <span
                      className={`font-medium ${
                        isActive ? "text-orange-700" : isCompleted ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {step.name}
                    </span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="ml-auto">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📧 E-mail Notificatie</h4>
                <p className="text-sm text-blue-700">
                  Je ontvangt een e-mail zodra je headshots klaar zijn om te downloaden.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🎯 Wat Je Krijgt</h4>
                <p className="text-sm text-green-700">50+ professionele headshots in verschillende stijlen en poses.</p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">💡 Ondertussen...</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Sluit deze pagina gerust - het proces loopt door</li>
                <li>• Check je e-mail voor updates</li>
                <li>• Bereid je LinkedIn profiel voor op je nieuwe foto!</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
                Ga naar Dashboard
              </Button>

              <Button onClick={() => router.push("/")} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                Terug naar Home
              </Button>
            </div>

            <p className="text-center text-xs text-gray-500">
              Heb je vragen? Neem contact op via de chat in de rechterhoek.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
