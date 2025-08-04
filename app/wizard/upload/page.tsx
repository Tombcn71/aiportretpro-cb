"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"

interface UploadedPhoto {
  id: string
  file: File
  preview: string
  uploaded: boolean
  uploading: boolean
  error?: string
}

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [wizardSessionId, setWizardSessionId] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/welcome")
      return
    }

    // Get wizard session ID
    const sessionId = sessionStorage.getItem("wizardSessionId")
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    setWizardSessionId(sessionId)

    // Load existing photos if any
    const savedPhotos = sessionStorage.getItem("uploadedPhotos")
    if (savedPhotos) {
      try {
        const parsedPhotos = JSON.parse(savedPhotos)
        setPhotos(
          parsedPhotos.map((photo: any) => ({
            ...photo,
            uploaded: true,
            uploading: false,
          })),
        )
      } catch (error) {
        console.error("Error parsing saved photos:", error)
      }
    }
  }, [session, status, router])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      alert("Selecteer alleen afbeeldingsbestanden")
      return
    }

    if (photos.length + imageFiles.length > 10) {
      alert("Je kunt maximaal 10 foto's uploaden")
      return
    }

    const newPhotos: UploadedPhoto[] = imageFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      uploading: true,
    }))

    setPhotos((prev) => [...prev, ...newPhotos])

    // Upload each photo
    for (const photo of newPhotos) {
      await uploadPhoto(photo)
    }
  }

  const uploadPhoto = async (photo: UploadedPhoto) => {
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
        prev.map((p) => (p.id === photo.id ? { ...p, uploaded: true, uploading: false, url: result.url } : p)),
      )
    } catch (error) {
      console.error("Upload error:", error)
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, uploaded: false, uploading: false, error: "Upload mislukt" } : p)),
      )
    }
  }

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === photoId)
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter((p) => p.id !== photoId)
    })
  }

  const handleNext = async () => {
    const uploadedPhotos = photos.filter((p) => p.uploaded)

    if (uploadedPhotos.length < 4) {
      alert("Upload minimaal 4 foto's om door te gaan")
      return
    }

    if (!wizardSessionId) return

    setLoading(true)

    try {
      // Save photos to sessionStorage
      const photosData = uploadedPhotos.map((photo) => ({
        id: photo.id,
        url: (photo as any).url,
        preview: photo.preview,
      }))
      sessionStorage.setItem("uploadedPhotos", JSON.stringify(photosData))

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId,
          photos: photosData,
        }),
      })

      console.log("✅ Photos saved:", photosData.length)
      router.push("/wizard/checkout")
    } catch (error) {
      console.error("Error saving photos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/gender")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const uploadedCount = photos.filter((p) => p.uploaded).length
  const uploadingCount = photos.filter((p) => p.uploading).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Progress value={100} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">Stap 3 van 3</p>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Upload je foto's</CardTitle>
            <p className="text-gray-600 mt-2">Upload 4-10 foto's van jezelf voor de beste resultaten</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Sleep foto's hierheen of klik om te selecteren</p>
              <p className="text-sm text-gray-600 mb-4">Ondersteunde formaten: JPG, PNG, WEBP (max 10MB per foto)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline" className="cursor-pointer bg-transparent">
                <label htmlFor="file-upload">Selecteer Foto's</label>
              </Button>
            </div>

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      {photo.uploading && (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      )}
                      {photo.uploaded && <CheckCircle className="h-6 w-6 text-green-500" />}
                      {photo.error && <AlertCircle className="h-6 w-6 text-red-500" />}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Status */}
            {photos.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {uploadedCount} van {photos.length} foto's geüpload
                  {uploadingCount > 0 && ` (${uploadingCount} uploading...)`}
                </p>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload foto's met goede belichting</li>
                <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
                <li>• Gebruik verschillende hoeken en uitdrukkingen</li>
                <li>• Vermijd zonnebrillen of hoeden</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-3 bg-transparent"
                disabled={loading || uploadingCount > 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>
              <Button
                onClick={handleNext}
                disabled={uploadedCount < 4 || loading || uploadingCount > 0}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white py-3"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Naar Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">Ingelogd als {session.user?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
