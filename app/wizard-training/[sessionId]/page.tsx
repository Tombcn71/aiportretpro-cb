"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function TrainingPage() {
  const params = useParams()
  const router = useRouter()
  const [status, setStatus] = useState("training")
  const sessionId = params.sessionId as string

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/wizard-training/status?sessionId=${sessionId}`)
        const data = await response.json()
        setStatus(data.status)

        if (data.status === "completed") {
          setTimeout(() => router.push("/dashboard"), 2000)
        }
      } catch (error) {
        console.error("Status check error:", error)
      }
    }

    const interval = setInterval(checkStatus, 5000)
    checkStatus()

    return () => clearInterval(interval)
  }, [sessionId, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">AI Training in Progress</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "training" ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <div className="space-y-2">
                <p className="font-semibold">Je foto's worden getraind...</p>
                <p className="text-sm text-gray-600">Dit duurt ongeveer 10-15 minuten</p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div className="space-y-2">
                <p className="font-semibold">Training voltooid!</p>
                <p className="text-sm text-gray-600">Je wordt doorgestuurd naar je dashboard...</p>
              </div>
            </>
          )}

          <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">
            Ga naar Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
