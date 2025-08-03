"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectNamePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [projectName, setProjectName] = useState("")

  if (!session) {
    router.push("/login?flow=wizard")
    return null
  }

  const handleNext = () => {
    if (!projectName.trim()) return

    // Save to sessionStorage
    const wizardData = { projectName: projectName.trim() }
    sessionStorage.setItem("wizardData", JSON.stringify(wizardData))

    router.push("/wizard/gender")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Stap 1: Project Naam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Bijv. Mijn LinkedIn Foto's"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleNext()}
          />
          <Button onClick={handleNext} disabled={!projectName.trim()} className="w-full">
            Volgende
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
