"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle successful payment
  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      console.log("Payment successful, session ID:", sessionId)
      // Clear any pending project data since payment was successful
      localStorage.removeItem("pendingProject")
    }
  }, [searchParams])

  const handleContinue = () => {
    if (projectName.trim()) {
      localStorage.setItem(
        "wizardData",
        JSON.stringify({
          projectName: projectName.trim(),
          selectedPackId: "928", // Portetfotos m/v pack
          step: 1,
        }),
      )
      router.push("/wizard/gender")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <ProgressBar currentStep={1} totalSteps={3} />
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Geef je project een naam</CardTitle>
            <p className="text-gray-600">Kies een naam zodat je je portetfotos later makkelijk kunt terugvinden</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Naam</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="bijv. Mijn LinkedIn Foto's"
                className="text-lg"
              />
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleContinue}
                disabled={!projectName.trim()}
                className="w-full bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                Doorgaan
              </Button>

              <Button variant="ghost" onClick={() => router.back()} className="w-full">
                ← Terug
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
