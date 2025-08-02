"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2 } from "lucide-react"

export default function ProcessingPage() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Verwerken van je betaling...")
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Simulate processing steps
        setStatus("Betaling geverifieerd...")
        setProgress(25)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setStatus("Project wordt aangemaakt...")
        setProgress(50)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setStatus("AI training gestart...")
        setProgress(75)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setStatus("Voltooid! Je wordt doorgestuurd...")
        setProgress(100)
        setIsComplete(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Clear any wizard data from localStorage
        localStorage.removeItem("wizard_project_name")
        localStorage.removeItem("wizard_gender")
        localStorage.removeItem("wizard_uploaded_photos")

        // Redirect to dashboard
        router.push("/dashboard")
      } catch (error) {
        console.error("❌ Error processing payment:", error)
        setStatus("Er is een fout opgetreden. Je wordt doorgestuurd...")
        setTimeout(() => router.push("/dashboard"), 3000)
      }
    }

    processPayment()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {isComplete ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isComplete ? "Betaling Voltooid!" : "Bezig met verwerken..."}
            </h1>
            <p className="text-gray-600 mb-6">{status}</p>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">
              {isComplete ? "Je AI headshots worden gegenereerd..." : "Even geduld..."}
            </p>
          </div>

          {isComplete && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                Je project is aangemaakt en de AI training is gestart. Je ontvangt een email wanneer je headshots klaar
                zijn (ongeveer 15-20 minuten).
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
