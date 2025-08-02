"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Sparkles, Camera, Zap } from "lucide-react"

export default function ProcessingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Initializing...")

  useEffect(() => {
    // Clear wizard data since payment is complete
    localStorage.removeItem("wizardData")

    const steps = [
      "Initializing AI training...",
      "Processing your photos...",
      "Training your personal model...",
      "Generating professional headshots...",
      "Finalizing results...",
    ]

    let stepIndex = 0
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2

        // Update step based on progress
        const stepProgress = Math.floor(newProgress / 20)
        if (stepProgress < steps.length && stepProgress !== stepIndex) {
          stepIndex = stepProgress
          setCurrentStep(steps[stepIndex])
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          // Redirect to dashboard after completion
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        }

        return Math.min(newProgress, 100)
      })
    }, 500)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Creating Your Headshots</h1>
              <p className="text-gray-600">Our AI is working hard to generate your professional photos</p>
            </div>

            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4" />
                <span>{currentStep}</span>
              </div>
              <p className="text-xs text-gray-500">
                {progress}% complete • Estimated time: {Math.max(1, Math.ceil((100 - progress) / 10))} minutes
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Camera className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                <p className="text-xs text-gray-600">High Quality</p>
              </div>
              <div className="text-center">
                <Sparkles className="w-6 h-6 mx-auto text-purple-500 mb-1" />
                <p className="text-xs text-gray-600">AI Powered</p>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 mx-auto text-yellow-500 mb-1" />
                <p className="text-xs text-gray-600">Fast Results</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
