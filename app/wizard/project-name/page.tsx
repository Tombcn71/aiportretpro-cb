"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Load existing project name from sessionStorage
    const savedName = sessionStorage.getItem("wizard_projectName")
    if (savedName) {
      setProjectName(savedName)
    }
  }, [session, router])

  const handleNext = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    try {
      // Save to sessionStorage
      sessionStorage.setItem("wizard_projectName", projectName)

      // Navigate to gender selection
      router.push("/wizard/gender")
    } catch (error) {
      console.error("Error saving project name:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Geef je project een naam</CardTitle>
          <Progress value={25} className="w-full mt-4" style={{ backgroundColor: "#e5e7eb" }}>
            <div
              className="h-full transition-all duration-300 ease-in-out rounded-full"
              style={{
                width: "25%",
                backgroundColor: "#0077B5",
              }}
            />
          </Progress>
          <p className="text-sm text-gray-600 mt-2">Stap 1 van 4</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
              Project naam
            </Label>
            <Input
              id="projectName"
              type="text"
              placeholder="Bijv. Mijn professionele headshots"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full"
              maxLength={50}
            />
            <p className="text-xs text-gray-500">{projectName.length}/50 karakters</p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!projectName.trim() || isLoading}
            className="w-full"
            style={{ backgroundColor: "#0077B5" }}
          >
            {isLoading ? "Bezig..." : "Volgende"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
