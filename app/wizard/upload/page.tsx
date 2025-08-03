"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    const newPhotos: string[] = []
    const totalFiles = acceptedFiles.length

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i]

      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const { url } = await response.json()
        newPhotos.push(url)

        setUploadProgress(((i + 1) / totalFiles) * 100)
      } catch (error) {
        console.error("Upload error:", error)
      }
    }

    setUploadedPhotos((prev) => [...prev, ...newPhotos])
    setUploading(false)
    setUploadProgress(0)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  })

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    if (uploadedPhotos.length < 6) return

    // Save to sessionStorage
    sessionStorage.setItem("uploadedPhotos", JSON.stringify(uploadedPhotos))

    // Save to wizard session
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")

    if (wizardSessionId && projectName && gender) {
      fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wizardSessionId,
          projectName,
          gender,
          uploadedPhotos,
        }),
      }).catch(console.error)
    }

    router.push("/wizard/review")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Stap 3 van 3</span>
            <span className="text-sm text-gray-500">Upload Foto's</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload je foto's</h1>
          <p className="text-lg text-gray-600">Upload minimaal 6 foto's voor de beste resultaten</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Foto Upload</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Upload Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-lg text-blue-600">Laat je foto's hier vallen...</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-600 mb-2">Sleep foto's hierheen of klik om te selecteren</p>
                  <p className="text-sm text-gray-500">JPG, PNG, WEBP tot 10MB per foto</p>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Uploaden...</span>
                  <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Photo Grid */}
            {uploadedPhotos.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Geüploade foto's ({uploadedPhotos.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Messages */}
            <div className="mt-6 space-y-2">
              {uploadedPhotos.length >= 6 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Perfect! Je hebt genoeg foto's geüpload.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>Upload nog {6 - uploadedPhotos.length} foto's om door te gaan.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={uploadedPhotos.length < 6 || uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Doorgaan naar Bestelling
          </Button>
        </div>
      </div>
    </div>
  )
}
