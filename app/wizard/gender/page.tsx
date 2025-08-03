"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GenderPage() {
  const router = useRouter()
  const [gender, setGender] = useState("")
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("wizardData")
    if (stored) {
      setWizardData(JSON.parse(stored))
    } else {
      router.push("/wizard/project-name")
    }
  }, [router])

  const handleNext = () => {
    if (!gender || !wizardData) return

    const updatedData = { ...wizardData, gender }
    sessionStorage.setItem("wizardData", JSON.stringify(updatedData))

    router.push("/wizard/upload")
  }

  if (!wizardData) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Stap 2: Geslacht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={gender === "man" ? "default" : "outline"}
              onClick={() => setGender("man")}
              className="h-20"
            >
              Man
            </Button>
            <Button
              variant={gender === "vrouw" ? "default" : "outline"}
              onClick={() => setGender("vrouw")}
              className="h-20"
            >
              Vrouw
            </Button>
          </div>
          <Button onClick={handleNext} disabled={!gender} className="w-full">
            Volgende
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
