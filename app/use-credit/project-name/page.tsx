"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const router = useRouter()

  const handleContinue = async () => {
    if (projectName.trim()) {
      // Check credits before allowing to continue
      try {
        const response = await fetch("/api/credits/balance")
        const data = await response.json()

        if (data.credits < 1) {
          // Redirect to pricing if no credits
          router.push("/pricing")
          return
        }

        localStorage.setItem(
          "wizardData",
          JSON.stringify({
            projectName: projectName.trim(),
            step: 1,
          }),
        )
        router.push("/use-credit/gender")
      } catch (error) {
        console.error("Error checking credits:", error)
        router.push("/pricing")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
          </div>
          <CardTitle className="text-2xl">Projectnaam</CardTitle>
          <p className="text-gray-600">Kies een naam zodat je je portetfotos later makkelijk kunt terugvinden</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName">Photoshoot Naam</Label>
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
              Continue
            </Button>

            <Button variant="ghost" onClick={() => router.back()} className="w-full">
              ← Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
