"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function GenderPage() {
  const [selectedGender, setSelectedGender] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!selectedGender) return

    setIsLoading(true)

    // Store gender in sessionStorage
    sessionStorage.setItem("wizardGender", selectedGender)

    // Navigate to upload
    router.push("/wizard/upload")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Select Gender</CardTitle>
          <p className="text-gray-600">Choose your gender for better AI results</p>
          <Progress value={67} className="mt-4" />
          <p className="text-sm text-gray-500 mt-2">Step 2 of 3</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedGender === "male" ? "default" : "outline"}
              onClick={() => setSelectedGender("male")}
              className="h-20 text-lg"
            >
              Male
            </Button>
            <Button
              variant={selectedGender === "female" ? "default" : "outline"}
              onClick={() => setSelectedGender("female")}
              className="h-20 text-lg"
            >
              Female
            </Button>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!selectedGender || isLoading}>
            {isLoading ? "Next..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
