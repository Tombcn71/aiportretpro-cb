"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WizardProjectName() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?callbackUrl=/wizard/project-name")
      return
    }

    // Load saved project name from localStorage
    const savedName = localStorage.getItem("wizard_project_name")
    if (savedName) {
      setProjectName(savedName)
    }
  }, [session, status, router])

  const handleContinue = async () => {
    if (!projectName.trim()) return

    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("wizard_project_name", projectName.trim())

      // Navigate to next step
      router.push("/wizard/gender")
    } catch (error) {
      console.error("Error saving project name:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Geef je project een naam</CardTitle>
          <p className="text-gray-600">Dit helpt je om je portretten later terug te vinden</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project naam</Label>
            <Input
              id="projectName"
              type="text"
              placeholder="Bijv. LinkedIn Foto's 2025"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="text-lg"
              maxLength={50}
            />
            <p className="text-sm text-gray-500">{projectName.length}/50 karakters</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/wizard/welcome">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Link>
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!projectName.trim() || isLoading}
              className="flex-1 bg-[#FF8C00] hover:bg-[#FFA500] text-white"
            >
              {isLoading ? "Bezig..." : "Verder"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">Stap 1 van 3</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-[#0077B5] h-2 rounded-full w-1/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
