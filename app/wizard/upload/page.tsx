"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X } from "lucide-react"

export default function UploadPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we have wizard data
    const wizardData = sessionStorage.getItem("wizardData")
    if (!wizardData) {
      router.push("/wizard/project-name")
      return
    }

    const data = JSON.parse(wizardData)
    if (!data.gender) {
      router.push("/wizard/gender")
      return
    }
  }, [router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsLoading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        return data.url
      })

      const urls = await Promise.all(uploadPromises)
      setUploadedImages((prev) => [...prev, ...urls])
    } catch (error) {
      console.error("Upload error:", error)
      alert("Er ging iets mis bij het uploaden. Probeer opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadedImages.length < 4) return

    setIsLoading(true)

    // Update sessionStorage
    const existingData = JSON.parse(sessionStorage.getItem("wizardData") || "{}")
    sessionStorage.setItem(
      "wizardData",
      JSON.stringify({
        ...existingData,
        images: uploadedImages,
        step: 3,
      }),
    )

    router.push("/wizard/review")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={75} className="w-full h-2" style={{ backgroundColor: "#e5e7eb" }}>
              <div
                className="h-full transition-all duration-300 ease-in-out rounded-full"
                style={{
                  width: "75%",
                  backgroundColor: "#0077B5",
                }}
              />
            </Progress>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Upload je foto's</CardTitle>
          <p className="text-gray-600 mt-2">Stap 3 van 4: Upload minimaal 4 foto's voor de beste resultaten</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                <Upload className="h-12 w-12 text-gray-400" />
                <span className="text-lg font-medium text-gray-900">Klik om foto's te uploaden</span>
                <span className="text-sm text-gray-500">Of sleep bestanden hierheen</span>
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">{uploadedImages.length} van minimaal 4 foto's geüpload</p>
            </div>

            <Button
              type="submit"
              disabled={uploadedImages.length < 4 || isLoading}
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
