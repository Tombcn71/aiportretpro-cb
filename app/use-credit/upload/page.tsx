"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Camera } from "lucide-react"
import Image from "next/image"

export default function UploadPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 120 * 1024 * 1024,
    )
    setUploadedPhotos((prev) => [...prev, ...newFiles].slice(0, 10))
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContinue = async () => {
    if (uploadedPhotos.length < 4) return
    setUploading(true)

    try {
      // Upload photos to Vercel Blob
      const uploadPromises = uploadedPhotos.map(async (photo) => {
        const formData = new FormData()
        formData.append("file", photo)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()
        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)

      // Get wizard data from localStorage
      const wizardData = JSON.parse(localStorage.getItem("wizardData") || "{}")

      // Create project with uploaded photos using credit
      const response = await fetch("/api/projects/create-with-credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: wizardData.projectName,
          gender: wizardData.gender,
          uploadedPhotos: uploadedUrls,
        }),
      })

      const result = await response.json()

      if (result.projectId) {
        // Clear wizard data
        localStorage.removeItem("wizardData")
        router.push(`/generate/${result.projectId}`)
      } else {
        throw new Error(result.error || "Failed to create project")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div className="w-8 h-1 bg-green-500 rounded"></div>
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div className="w-8 h-1 bg-green-500 rounded"></div>
              <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
            </div>
            <CardTitle className="text-2xl">Upload Je Foto's</CardTitle>
            <p className="text-gray-600">Upload minimaal 6 hoge kwaliteit foto's voor het beste resultaat</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Camera className="h-8 w-8 text-[#0077B5]" />
              <div>
                <h3 className="text-lg font-semibold">Foto Richtlijnen</h3>
                <p className="text-gray-600 text-sm">
                   Foto's met verschillende achtergronden met verschillende kleding. Gezicht naar de camera, vanaf je schouders of je middel. geen hoeden of zonnebrillen.
                </p>
              </div>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors relative"
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Button className="bg-[#0077B5] hover:bg-[#004182] text-white mb-4">
                <Upload className="h-4 w-4 mr-2" />
                Selecteer Foto's
              </Button>
              <p className="text-gray-600">
                of <span className="text-[#0077B5] font-medium">sleep en zet neer</span> je foto's hier
              </p>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG, HEIC, WEBP tot 120MB</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Geüploade Foto's</h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${uploadedPhotos.length >= 4 ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
                <span className="text-sm font-medium">{uploadedPhotos.length} van 10</span>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                {uploadedPhotos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Nog geen foto's geüpload</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={URL.createObjectURL(photo) || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button
                onClick={handleContinue}
                disabled={uploadedPhotos.length < 4 || uploading}
                className="w-full bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                {uploading ? "Portetfotos Worden Gemaakt..." : "Gebruik 1 Credit - Genereer Portetfotos"}
              </Button>

              <Button variant="ghost" onClick={() => router.back()} className="w-full" disabled={uploading}>
                ← Terug
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
