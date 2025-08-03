"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function GenderPage() {
  const [gender, setGender] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const projectName = sessionStorage.getItem("projectName")
    if (!projectName) {
      router.push("/wizard/project-name")
    }
  }, [router])

  const handleSubmit = async (selectedGender: string) => {
    setIsLoading(true)
    setGender(selectedGender)

    // Store gender in sessionStorage
    sessionStorage.setItem("gender", selectedGender)

    router.push("/wizard/upload")
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Select Gender</CardTitle>
          <p className="text-gray-600">Step 2 of 3</p>
          <Progress value={67} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">This helps us generate better headshots for you</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 text-lg bg-transparent"
              onClick={() => handleSubmit("male")}
              disabled={isLoading}
            >
              👨 Male
            </Button>
            <Button
              variant="outline"
              className="h-20 text-lg bg-transparent"
              onClick={() => handleSubmit("female")}
              disabled={isLoading}
            >
              👩 Female
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
