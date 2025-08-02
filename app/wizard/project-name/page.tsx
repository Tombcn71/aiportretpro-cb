"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function ProjectNamePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    // Clear ALL wizard data when starting fresh
    localStorage.removeItem("wizard_project_name")
    localStorage.removeItem("wizard_gender")
    localStorage.removeItem("wizard_uploaded_photos")
    localStorage.removeItem("wizardData")

    console.log("🧹 Cleared all wizard data")
  }, [session, router])

  const handleNext = () => {
    if (!projectName.trim()) return

    // Save to localStorage
    localStorage.setItem("wizard_project_name", projectName.trim())
    console.log("💾 Saved project name:", projectName.trim())

    router.push("/wizard/gender")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/wizard/welcome")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex space-x-2">
                <div className="h-2 bg-blue-600 rounded-full flex-1"></div>
                <div className="h-2 bg-gray-200 rounded-full flex-1"></div>
                <div className="h-2 bg-gray-200 rounded-full flex-1"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Step 1 of 3</p>
            </div>
          </div>
          <CardTitle className="text-2xl">What's your project name?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="e.g., LinkedIn Profile Photos"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleNext()}
              autoFocus
            />
            <p className="text-sm text-gray-500">Choose a name to help you identify this project later</p>
          </div>

          <Button onClick={handleNext} disabled={!projectName.trim()} className="w-full">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
