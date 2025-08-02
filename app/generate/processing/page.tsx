"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Upload } from "lucide-react"

export default function ProcessingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Initializing...")

  useEffect(() => {
    if (!session?.user?.email) {
      router.push("/login")
      return
    }

    // Clear ALL wizard data since payment is complete
    console.log("🧹 Clearing all wizard data after successful payment")
    localStorage.removeItem("wizard_project_name")
    localStorage.removeItem("wizard_gender")
    localStorage.removeItem("wizard_uploaded_photos")
    localStorage.removeItem("wizardData")

    // Simulate processing steps
    const steps = [
      { message: "Payment verified...", progress: 20 },
      { message: "Creating your project...", progress: 40 },
      { message: "Starting AI training...", progress: 60 },
      { message: "Processing your photos...", progress: 80 },
      { message: "Almost done...", progress: 95 },
      { message: "Complete! Redirecting...", progress: 100 },
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setStatus(steps[currentStep].message)
        setProgress(steps[currentStep].progress)
        currentStep++
      } else {
        clearInterval(interval)
        // Redirect to dashboard after completion
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [session, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {progress < 50 ? (
                <Upload className="w-8 h-8 text-blue-600" />
              ) : progress < 100 ? (
                <Clock className="w-8 h-8 text-blue-600" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">Processing Your Order</h1>
            <p className="text-gray-600">{status}</p>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-gray-500">{progress}% complete</p>
          </div>

          <div className="mt-8 space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Payment processed successfully</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Photos uploaded and validated</span>
            </div>
            <div className="flex items-center">
              {progress >= 50 ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span>AI model training started</span>
            </div>
            <div className="flex items-center">
              {progress >= 100 ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
              )}
              <span>Headshots will be ready soon</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            This usually takes 10-15 minutes. You'll be redirected automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
