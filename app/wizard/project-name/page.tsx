"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Load saved project name
    const savedName = sessionStorage.getItem("wizard_projectName")
    if (savedName) {
      setProjectName(savedName)
    }
  }, [session, router])

  const handleNext = () => {
    if (projectName.trim()) {
      sessionStorage.setItem("wizard_projectName", projectName.trim())
      router.push("/wizard/gender")
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "25%" }}></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Wat is de naam van je project?</h1>
            <p className="text-gray-600">Geef je project een naam zodat je het later makkelijk kunt terugvinden.</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="projectName" className="text-base font-medium text-gray-700">
                Project naam
              </Label>
              <Input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Bijv. LinkedIn profielfoto's"
                className="mt-2 h-12 text-base"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && projectName.trim()) {
                    handleNext()
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t bg-white">
        <Button
          onClick={handleNext}
          disabled={!projectName.trim()}
          className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volgende →
        </Button>
      </div>
    </div>
  )
}
