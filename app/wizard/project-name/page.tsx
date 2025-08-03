"use client"
import { v4 as uuidv4 } from "uuid"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (projectName.trim()) {
      sessionStorage.setItem("projectName", projectName.trim())
      sessionStorage.setItem("wizardSessionId", uuidv4())
      console.log("✅ Project name saved:", projectName.trim())
      router.push("/wizard/gender")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={25} className="w-full h-2" style={{ backgroundColor: "#e5e7eb" }}>
              <div
                className="h-full transition-all duration-300 ease-in-out rounded-full"
                style={{
                  width: "25%",
                  backgroundColor: "#0077B5",
                }}
              />
            </Progress>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Geef je project een naam</CardTitle>
          <p className="text-gray-600 mt-2">Stap 1 van 4: Kies een naam voor je AI headshot project</p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleNext()
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                Project naam
              </Label>
              <Input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Bijv. Mijn professionele headshots"
                className="w-full"
                required
              />
            </div>

            <Button
              type="button"
              onClick={handleNext}
              disabled={!projectName.trim() || isLoading}
              className="w-full"
              style={{ backgroundColor: "#0077B5" }}
            >
              {isLoading ? "Bezig..." : "Volgende stap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
