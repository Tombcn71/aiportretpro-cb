"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProjectNamePage() {
  const [projectName, setProjectName] = useState("")
  const router = useRouter()

  const handleNext = () => {
    if (projectName.trim()) {
      localStorage.setItem("wizardData", JSON.stringify({ projectName }))
      router.push("/wizard/gender")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-600 h-2 w-1/4"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Wat is de naam van je project?</h1>
            <p className="text-gray-600">Geef je fotoshoot een naam zodat je deze later makkelijk kunt terugvinden.</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                Project naam
              </Label>
              <Input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Bijv. LinkedIn profielfoto's"
                className="mt-1 w-full"
              />
            </div>

            <Button
              onClick={handleNext}
              disabled={!projectName.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium text-lg"
            >
              Volgende →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
