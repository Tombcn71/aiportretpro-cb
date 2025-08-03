"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Upload, X, Check } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"
import Image from "next/image"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Check if previous steps are completed
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")

    if (!projectName) {
      console.log("❌ No project name, redirecting to project-name")
      router.push("/wizard/project-name")
      return
    }

    if (!gender) {
      console.log("❌ No gender, redirecting to gender")
      router.push("/wizard/gender")
      return
    }

    // Load existing photos if available
    const savedPhotos = sessionStorage.getItem("uploadedPhotos")
    if (savedPhotos) {
      try {
        const photos = JSON.parse(savedPhotos)
        setUploadedPhotos(photos)
        console.log("✅ Loaded existing photos:", photos.length)
      } catch (error) {
        console.error("Error parsing saved photos:", error)
      }
    }
  }, [session, status, router])

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return

      setUploading(true)

      try {
        const newPhotos: string[] = []

        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          // Check file type
          if (!file.type.startsWith("image/")) {
            console.error("Invalid file type:", file.type)
            continue
          }

          // Check file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            console.error("File too large:", file.size)
            continue
          }

          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            newPhotos.push(data.url)
            console.log("✅ Photo uploaded:", data.url)
          } else {
            console.error("Upload failed for file:", file.name)
          }
        }

        if (newPhotos.length > 0) {
          const updatedPhotos = [...uploadedPhotos, ...newPhotos]
          setUploadedPhotos(updatedPhotos)
          sessionStorage.setItem("uploadedPhotos", JSON.stringify(updatedPhotos))
          console.log("✅ All photos saved to sessionStorage:", updatedPhotos.length)
        }
      } catch (error) {
        console.error("Upload error:", error)
      } finally {
        setUploading(false)
      }
    },
    [uploadedPhotos],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      handleFileUpload(files)
    },
    [handleFileUpload],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileUpload(e.target.files)
      }
    },
    [handleFileUpload],
  )

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updatedPhotos)
    sessionStorage.setItem("uploadedPhotos", JSON.stringify(updatedPhotos))
    console.log("✅ Photo removed, remaining:", updatedPhotos.length)
  }

  const handleNext = async () => {
    if (uploadedPhotos.length >= 6) {
      // Save wizard data to server
      const sessionId = sessionStorage.getItem("wizardSessionId")
      const projectName = sessionStorage.getItem("projectName")
      const gender = sessionStorage.getItem("gender")

      try {
        await fetch("/api/wizard/save-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            projectName,
            gender,
            uploadedPhotos,
            userEmail: session?.user?.email,
          }),
        })
        console.log("✅ Wizard data saved to server")
      } catch (error) {
        console.error("❌ Failed to save wizard data:", error)
      }

      // Go to review page
      router.push("/wizard/review")
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={3} totalSteps={3} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Upload je foto's</CardTitle>
            <p className="text-gray-600">Upload minimaal 6 foto's van jezelf. Meer foto's = betere resultaten!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0077B5] transition-colors"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Sleep foto's hierheen of klik om te uploaden</p>
              <p className="text-sm text-gray-500 mb-4">JPG, PNG of WEBP - Max 10MB per foto</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={uploading}
                className="bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                {uploading ? "Uploaden..." : "Selecteer foto's"}
              </Button>
            </div>

            {/* Photo Grid */}
            {uploadedPhotos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Geüploade foto's ({uploadedPhotos.length})</h3>
                  {uploadedPhotos.length >= 6 && (
                    <div className="flex items-center text-green-600">
                      <Check className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Klaar om door te gaan!</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={photo || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress indicator */}
            {uploadedPhotos.length > 0 && uploadedPhotos.length < 6 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  Je hebt nog {6 - uploadedPhotos.length} foto's nodig om door te kunnen gaan. Meer foto's geven betere
                  resultaten!
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/gender")} className="text-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={uploadedPhotos.length < 6}
                className="bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                Naar review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
