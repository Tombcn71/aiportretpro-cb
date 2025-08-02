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
  const [projectId, setProjectId] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.email) {
      router.push("/login")
      return
    }

    const createProject = async () => {
      try {
        // Get wizard data from localStorage
        const projectName = localStorage.getItem("wizard_project_name")
        const gender = localStorage.getItem("wizard_gender")
        const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

        if (!projectName || !gender || !uploadedPhotos) {
          console.error("Missing wizard data")
          router.push("/wizard/welcome")
          return
        }

        const wizardData = {
          projectName,
          gender,
          uploadedPhotos: JSON.parse(uploadedPhotos),
        }

        console.log("🚀 Creating project with wizard data:", wizardData)
        setStatus("Creating your project...")
        setProgress(20)

        // Create project with pack
        const response = await fetch("/api/projects/create-with-pack", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            uploadedPhotos: wizardData.uploadedPhotos,
            packId: wizardData.gender === "man" ? "clkv6uxh40001l608ovk7lhpx" : "clkv6uy8g0003l608rk8d5vc6",
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ Error creating project:", errorText)
          throw new Error(`Failed to create project: ${response.status}`)
        }

        const result = await response.json()
        console.log("✅ Project created:", result)

        setProjectId(result.projectId)
        setStatus("Starting AI training...")
        setProgress(50)

        // Clear wizard data from localStorage
        localStorage.removeItem("wizard_project_name")
        localStorage.removeItem("wizard_gender")
        localStorage.removeItem("wizard_uploaded_photos")

        // Simulate training progress
        setTimeout(() => {
          setStatus("Training AI model...")
          setProgress(75)
        }, 2000)

        setTimeout(() => {
          setStatus("Almost done...")
          setProgress(90)
        }, 4000)

        // Redirect to dashboard after 6 seconds
        setTimeout(() => {
          setStatus("Complete! Redirecting...")
          setProgress(100)
          router.push("/dashboard")
        }, 6000)
      } catch (error) {
        console.error("❌ Error in processing:", error)
        setStatus("Error occurred. Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      }
    }

    createProject()
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
            <h1 className="text-2xl font-bold mb-2">Processing Your Headshots</h1>
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
