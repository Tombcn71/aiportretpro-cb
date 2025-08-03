"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function UploadPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [projectName, setProjectName] = useState("")
  const [gender, setGender] = useState("")
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    const savedProjectName = sessionStorage.getItem("projectName")
    const savedGender = sessionStorage.getItem("gender")
    const savedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")

    if (!savedProjectName || !savedGender) {
      router.push("/wizard/gender")
      return
    }

    setProjectName(savedProjectName)
    setGender(savedGender)
    setUploadedPhotos(savedPhotos)
  }, [session, router])

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return

    setUploading(true)

    try {
      const newPhotos: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith("image/")) continue

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const { url } = await response.json()
          newPhotos.push(url)
        }
      }

      const updatedPhotos = [...uploadedPhotos, ...newPhotos]
      setUploadedPhotos(updatedPhotos)
      sessionStorage.setItem("uploadedPhotos", JSON.stringify(updatedPhotos))
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updatedPhotos)
    sessionStorage.setItem("uploadedPhotos", JSON.stringify(updatedPhotos))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleContinue = () => {
    if (uploadedPhotos.length >= 6) {
      router.push("/wizard/review")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.push("/wizard/gender")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug
          </Button>
          <div className="flex items-center space-x-3">
            <Image src="/images/logo-icon.png" alt="Aragon AI" width={32} height={32} />
            <span className="text-xl font-bold">Aragon AI</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Stap 3 van 3</span>
            <span>Upload Foto's</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Upload je foto's</CardTitle>
              <p className="text-center text-gray-600">Upload minimaal 6 foto's van jezelf voor de beste resultaten</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Sleep foto's hierheen of klik om te uploaden</p>
                <p className="text-gray-600 mb-4">PNG, JPG tot 10MB per foto</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Selecteer Foto's
                  </label>
                </Button>
              </div>

              {/* Uploaded Photos */}
              {uploadedPhotos.length > 0 && (
                <div>
                  <h3 className="font-medium mb-4">Geüploade foto's ({uploadedPhotos.length})</h3>
                  <div className="grid grid-cols-3 gap-4">
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

              {/* Upload Status */}
              {uploading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Foto's uploaden...</p>
                </div>
              )}

              {/* Continue Button */}
              <div className="text-center">
                <Button
                  onClick={handleContinue}
                  disabled={uploadedPhotos.length < 6}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  Doorgaan naar Bestelling ({uploadedPhotos.length}/6)
                </Button>
                {uploadedPhotos.length < 6 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Upload nog {6 - uploadedPhotos.length} foto's om door te gaan
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
