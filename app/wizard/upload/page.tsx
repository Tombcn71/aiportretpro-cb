"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, CheckCircle } from "lucide-react"

export default function UploadPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?flow=wizard")
      return
    }

    // Check if previous steps are completed
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")

    if (!projectName || !gender) {
      router.push("/wizard/project-name")
      return
    }

    // Load existing photos if available
    const savedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")
    if (savedPhotos.length > 0) {
      setUploadedPhotos(savedPhotos)
    }
  }, [session, status, router])

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (uploadedPhotos.length + files.length > 10) {
        alert("Je kunt maximaal 10 foto's uploaden")
        return
      }

      setIsUploading(true)

      try {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error("Upload failed")
          }

          const data = await response.json()
          return data.url
        })

        const newUrls = await Promise.all(uploadPromises)
        const updatedPhotos = [...uploadedPhotos, ...newUrls]

        setUploadedPhotos(updatedPhotos)
        sessionStorage.setItem("uploadedPhotos", JSON.stringify(updatedPhotos))
      } catch (error) {
        console.error("Upload error:", error)
        alert("Er is een fout opgetreden bij het uploaden. Probeer het opnieuw.")
      } finally {
        setIsUploading(false)
      }
    },
    [uploadedPhotos],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileUpload(files)
      }
    },
    [handleFileUpload],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updatedPhotos)
    sessionStorage.setItem("uploadedPhotos", JSON.stringify(updatedPhotos))
  }

  const handleNext = () => {
    if (uploadedPhotos.length < 6) return

    setIsLoading(true)
    router.push("/wizard/review")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
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
          <p className="text-gray-600 mt-2">
            Stap 3 van 4: Upload minimaal 6 foto's voor de beste resultaten ({uploadedPhotos.length}/10)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0077B5] transition-colors"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Sleep foto's hierheen of klik om te selecteren</p>
            <p className="text-sm text-gray-500 mb-4">JPG, PNG of JPEG bestanden tot 10MB per foto</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={isUploading || uploadedPhotos.length >= 10}
              variant="outline"
            >
              {isUploading ? "Uploaden..." : "Selecteer foto's"}
            </Button>
          </div>

          {/* Photo Grid */}
          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedPhotos.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Tips voor de beste resultaten:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload foto's met verschillende gezichtshoeken</li>
              <li>• Zorg voor goede belichting</li>
              <li>• Vermijd zonnebrillen of petten</li>
              <li>• Upload minimaal 6 foto's voor optimale resultaten</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.back()} className="flex-1">
              Vorige stap
            </Button>
            <Button
              onClick={handleNext}
              disabled={uploadedPhotos.length < 6 || isLoading}
              className="flex-1 text-lg py-3"
              style={{ backgroundColor: "#0077B5" }}
            >
              {isLoading ? "Bezig..." : `Doorgaan (${uploadedPhotos.length}/6)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
