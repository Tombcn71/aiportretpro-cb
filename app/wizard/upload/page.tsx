"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload } from "lucide-react"

export default function UploadPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [wizardData, setWizardData] = useState<any>({})
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("wizardData")
    if (data) {
      setWizardData(JSON.parse(data))
    }
  }, [])

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)
    const newPhotos: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith("image/")) {
        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            newPhotos.push(data.url)
          }
        } catch (error) {
          console.error("Upload failed:", error)
        }
      }
    }

    setUploadedPhotos((prev) => [...prev, ...newPhotos])
    setUploading(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFileUpload(e.dataTransfer.files)
    },
    [handleFileUpload],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileUpload(e.target.files)
      }
    },
    [handleFileUpload],
  )

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (uploadedPhotos.length >= 6) {
      const updatedData = { ...wizardData, uploadedPhotos }
      localStorage.setItem("wizardData", JSON.stringify(updatedData))
      router.push("/wizard/review")
    }
  }

  const handleBack = () => {
    router.push("/wizard/gender")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-600 h-2 w-3/4"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-8">
            ← Terug
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Instructions */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload je foto's</h1>
                <p className="text-gray-600 mb-6">
                  Upload minimaal 6 foto's van jezelf. Een mix van close-ups, selfies en mid-range shots kan helpen de
                  AI beter je gezicht en lichaamsbouw vast te leggen.
                </p>
              </div>

              {/* Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload vanaf je computer</h3>

                <label className="cursor-pointer">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Upload bestanden ↓</Button>
                  <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>

                <p className="text-sm text-gray-500 mt-4">of drag and drop je foto's</p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, HEIC, WEBP tot 120MB</p>
              </div>
            </div>

            {/* Right side - Uploaded photos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Geüploade afbeeldingen</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{uploadedPhotos.length}</span>
                  <span className="text-gray-500">van 10</span>
                </div>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="mb-4">
                  <Progress value={(uploadedPhotos.length / 10) * 100} className="h-2" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {uploading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Uploading...</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={handleNext}
              disabled={uploadedPhotos.length < 6}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-12 rounded-lg font-medium text-lg"
            >
              Volgende →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
