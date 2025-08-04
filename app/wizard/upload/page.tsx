"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Upload, X, Camera, AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"

interface UploadedPhoto {
  id: string
  file: File
  preview: string
  uploading: boolean
  uploaded: boolean
  error?: string
}

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/upload")
      return
    }

    // Check if we have all required wizard data
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")

    if (!wizardSessionId || !projectName || !gender) {
      router.push("/wizard/welcome")
      return
    }

    // Load existing photos if available
    const savedPhotos = sessionStorage.getItem("uploadedPhotos")
    if (savedPhotos) {
      try {
        const photoUrls = JSON.parse(savedPhotos)
        // Convert URLs back to photo objects (simplified for demo)
        const loadedPhotos = photoUrls.map((url: string, index: number) => ({
          id: `loaded-${index}`,
          file: null,
          preview: url,
          uploading: false,
          uploaded: true,
        }))
        setPhotos(loadedPhotos)
      } catch (error) {
        console.error("Error loading saved photos:", error)
      }
    }
  }, [session, status, router])

  const handleFileSelect = useCallback((files: FileList) => {
    const newPhotos: UploadedPhoto[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const preview = URL.createObjectURL(file)

        newPhotos.push({
          id,
          file,
          preview,
          uploading: false,
          uploaded: false,
        })
      }
    })

    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 20)) // Max 20 photos
  }, [])

  const uploadPhoto = async (photo: UploadedPhoto) => {
    if (!photo.file) return

    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, uploading: true, error: undefined } : p)))

    try {
      const formData = new FormData()
      formData.append("file", photo.file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? {
                ...p,
                uploading: false,
                uploaded: true,
                preview: result.url || p.preview,
              }
            : p,
        ),
      )
    } catch (error) {
      console.error("Upload error:", error)
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photo.id
            ? {
                ...p,
                uploading: false,
                error: "Upload mislukt",
              }
            : p,
        ),
      )
    }
  }

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === photoId)
      if (photo?.preview.startsWith("blob:")) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter((p) => p.id !== photoId)
    })
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileSelect(files)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleNext = async () => {
    const uploadedPhotos = photos.filter((p) => p.uploaded)

    if (uploadedPhotos.length < 6) {
      alert("Upload minimaal 6 foto's voor de beste resultaten")
      return
    }

    setIsLoading(true)

    try {
      // Save photo URLs to sessionStorage
      const photoUrls = uploadedPhotos.map((p) => p.preview)
      sessionStorage.setItem("uploadedPhotos", JSON.stringify(photoUrls))

      // Save to database
      const wizardSessionId = sessionStorage.getItem("wizardSessionId")
      const projectName = sessionStorage.getItem("projectName")
      const gender = sessionStorage.getItem("gender")

      if (wizardSessionId) {
        await fetch("/api/wizard/save-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wizardSessionId,
            projectName,
            gender,
            photos: photoUrls,
          }),
        })
      }

      router.push("/wizard/checkout")
    } catch (error) {
      console.error("Error saving photos:", error)
      // Continue anyway with sessionStorage
      router.push("/wizard/checkout")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/gender")
  }

  // Auto-upload new photos
  useEffect(() => {
    const photosToUpload = photos.filter((p) => !p.uploading && !p.uploaded && !p.error && p.file)
    photosToUpload.forEach((photo) => {
      uploadPhoto(photo)
    })
  }, [photos])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const uploadedCount = photos.filter((p) => p.uploaded).length
  const uploadingCount = photos.filter((p) => p.uploading).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Upload Foto's</CardTitle>
            <p className="text-gray-600 mt-2">Upload 6-20 foto's van jezelf voor de beste resultaten</p>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Stap 3 van 3</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Upload Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${uploadedCount >= 6 ? "bg-green-500" : "bg-orange-500"}`}></div>
                <span className="font-medium">
                  {uploadedCount} van {Math.max(6, photos.length)} foto's geüpload
                </span>
              </div>
              {uploadingCount > 0 && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                  <span className="text-sm">{uploadingCount} uploading...</span>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragging
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-orange-400 hover:bg-orange-25"
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sleep foto's hierheen of klik om te selecteren
              </h3>
              <p className="text-gray-600 mb-4">Ondersteunde formaten: JPG, PNG, WEBP (max 10MB per foto)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecteer Foto's
              </label>
            </div>

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={photo.preview || "/placeholder.svg"}
                        alt="Uploaded photo"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Status Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {photo.uploading && (
                        <div className="bg-black/50 rounded-full p-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                      {photo.uploaded && (
                        <div className="bg-green-500 rounded-full p-1 absolute top-2 right-2">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {photo.error && (
                        <div className="bg-red-500 rounded-full p-1 absolute top-2 right-2">
                          <AlertCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">📸 Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload foto's met goede belichting</li>
                <li>• Varieer in poses en achtergronden</li>
                <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
                <li>• Gebruik foto's van verschillende dagen</li>
                <li>• Minimaal 6 foto's, maximaal 20</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 h-12 bg-transparent"
                disabled={isLoading || uploadingCount > 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={uploadedCount < 6 || isLoading || uploadingCount > 0}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Naar Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
