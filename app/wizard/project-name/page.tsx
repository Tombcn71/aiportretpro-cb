"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const router = useRouter()

  const handleContinue = () => {
    if (projectName.trim()) {
      // Save project name to localStorage
      localStorage.setItem("wizard_project_name", projectName.trim())
      router.push("/wizard/gender")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <ProgressBar currentStep={1} totalSteps={4} />
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

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleContinue}
                disabled={!projectName.trim()}
                className="bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                Doorgaan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
