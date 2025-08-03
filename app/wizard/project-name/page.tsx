"use client"

import type React from "react"

import { useState } from "react"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return

    setIsLoading(true)

    // Store project name in sessionStorage
    const sessionId = crypto.randomUUID()
    sessionStorage.setItem("wizardSessionId", sessionId)
    sessionStorage.setItem("projectName", projectName.trim())

    router.push("/wizard/gender")
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Project Name</CardTitle>
          <p className="text-gray-600">Step 1 of 3</p>
          <Progress value={33} className="mt-2" />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="projectName">What should we call your project?</Label>
              <Input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Professional Headshots"
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={!projectName.trim() || isLoading}>
              {isLoading ? "Next..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
