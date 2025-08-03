"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

export default function UploadPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Check if previous steps are completed
    const projectName = sessionStorage.getItem("wizard_projectName")
    const gender = sessionStorage.getItem("wizard_gender")

    if (!projectName) {
      router.push("/wizard/project-name")
      return
    }

    if (!gender) {
      router.push("/wizard/gender")
      return
    }

    // Load saved photos
    const savedPhotos = sessionStorage.getItem("wizard_uploadedPhotos")
    if (savedPhotos) {
      try {
        const photos = JSON.parse(savedPhotos)
        setUploadedPhotos(photos)
      } catch (error) {
        console.error("Error parsing saved photos:", error)
      }
    }
  }, [session, router])

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!files.length) return

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
        sessionStorage.setItem("wizard_uploadedPhotos", JSON.stringify(updatedPhotos))
      } catch (error) {
        console.error("Upload error:", error)
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
    sessionStorage.setItem("wizard_uploadedPhotos", JSON.stringify(updatedPhotos))
  }

  const handleNext = () => {
    if (uploadedPhotos.length >= 4) {
      router.push("/wizard/review")
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "75%" }}></div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Instructions */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload je foto's</h1>
                <p className="text-gray-600 mb-6">
                  Upload minimaal 4 foto's van jezelf. Een mix van close-ups, selfies en mid-range shots kan de AI
                  helpen je gezicht en lichaamsbouw beter vast te leggen.
                </p>
              </div>

              {/* Upload from computer */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Upload vanaf je computer</h3>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload files"}
                    </Button>
                    <p className="text-sm text-gray-500 mt-4">
                      of drag and drop je foto's
                      <br />
                      PNG, JPG, HEIC, WEBP tot 120MB
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Right side - Uploaded photos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Geüploade foto's</h3>
                <div className="text-sm text-gray-500">{uploadedPhotos.length} van minimaal 4</div>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((uploadedPhotos.length / 4) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Uploaded photo ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {uploadedPhotos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nog geen foto's geüpload</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t bg-white">
        <Button
          onClick={handleNext}
          disabled={uploadedPhotos.length < 4}
          className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volgende →
        </Button>
      </div>
    </div>
  )
}
