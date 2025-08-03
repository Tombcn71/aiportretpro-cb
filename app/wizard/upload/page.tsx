"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Upload } from "lucide-react"
import Image from "next/image"

interface UploadedPhoto {
  file: File
  preview: string
  url?: string
}

export default function UploadPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedPhotos.length + acceptedFiles.length > 10) {
        alert("Je kunt maximaal 10 foto's uploaden")
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      const newPhotos: UploadedPhoto[] = []

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const preview = URL.createObjectURL(file)

        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            newPhotos.push({
              file,
              preview,
              url: data.url,
            })
          } else {
            console.error("Upload failed for file:", file.name)
            newPhotos.push({
              file,
              preview,
            })
          }
        } catch (error) {
          console.error("Upload error:", error)
          newPhotos.push({
            file,
            preview,
          })
        }

        setUploadProgress(((i + 1) / acceptedFiles.length) * 100)
      }

      setUploadedPhotos((prev) => [...prev, ...newPhotos])
      setIsUploading(false)
      setUploadProgress(0)
    },
    [uploadedPhotos.length],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"],
    },
    maxSize: 120 * 1024 * 1024, // 120MB
  })

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => {
      const newPhotos = [...prev]
      URL.revokeObjectURL(newPhotos[index].preview)
      newPhotos.splice(index, 1)
      return newPhotos
    })
  }

  const handleNext = async () => {
    if (uploadedPhotos.length < 6) {
      alert("Upload minimaal 6 foto's om door te gaan")
      return
    }

    setIsLoading(true)

    // Save photos to sessionStorage
    const photosData = uploadedPhotos.map((photo) => ({
      url: photo.url || photo.preview,
      name: photo.file.name,
    }))

    sessionStorage.setItem("uploadedPhotos", JSON.stringify(photosData))

    // Navigate to review
    router.push("/wizard/review")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div className="bg-blue-500 h-2 transition-all duration-300" style={{ width: "75%" }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Instructions */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload je foto's</h1>
              <p className="text-gray-600 text-lg mb-6">
                Upload minimaal 6 foto's van jezelf. Een mix van close-ups, selfies en mid-range shots kan helpen de AI
                beter je gezicht en lichaamsbouw vast te leggen.
              </p>
            </div>

            {/* Upload Area */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload vanaf je computer
                </h3>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Upload files ↓
                    </button>
                    <p className="text-gray-600">
                      of <span className="text-orange-500 font-medium">drag and drop</span> je foto's
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, HEIC, WEBP tot 120MB</p>
                  </div>
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-600 mt-2">Uploading... {Math.round(uploadProgress)}%</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side - Uploaded Images */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Uploaded Images</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{uploadedPhotos.length}</span>
                <span className="text-gray-500">6 of 10</span>
              </div>
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((uploadedPhotos.length / 6) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={photo.preview || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={uploadedPhotos.length < 6 || isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
              {isLoading ? "Bezig..." : "Volgende →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
