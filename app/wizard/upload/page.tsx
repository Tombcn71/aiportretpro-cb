"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Check } from "lucide-react"
import Image from "next/image"

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const router = useRouter()
  const { data: session } = useSession()

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (uploadedFiles.length + files.length > 10) {
        alert("Maximum 10 photos allowed")
        return
      }

      setIsUploading(true)
      const newFiles = Array.from(files)
      const newUploadedPhotos: string[] = []

      for (const file of newFiles) {
        try {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            newUploadedPhotos.push(data.url)
          }
        } catch (error) {
          console.error("Upload error:", error)
        }
      }

      setUploadedFiles((prev) => [...prev, ...newFiles])
      setUploadedPhotos((prev) => [...prev, ...newUploadedPhotos])
      setIsUploading(false)
    },
    [uploadedFiles.length],
  )

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContinue = async () => {
    if (uploadedPhotos.length < 6) {
      alert("Please upload at least 6 photos")
      return
    }

    // Get data from sessionStorage
    const projectName = sessionStorage.getItem("wizardProjectName")
    const gender = sessionStorage.getItem("wizardGender")

    if (!projectName || !gender) {
      alert("Missing project data. Please start over.")
      router.push("/wizard/project-name")
      return
    }

    // Save wizard data
    const sessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    try {
      const response = await fetch("/api/wizard/save-data", {
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

      if (response.ok) {
        sessionStorage.setItem("wizardSessionId", sessionId)
        router.push("/wizard/checkout")
      } else {
        alert("Failed to save data. Please try again.")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save data. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Upload Photos</CardTitle>
          <p className="text-gray-600">Upload 6-10 high-quality photos of yourself</p>
          <Progress value={100} className="mt-4" />
          <p className="text-sm text-gray-500 mt-2">Step 3 of 3</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Click to upload photos</p>
              <p className="text-sm text-gray-500">
                PNG, JPG up to 10MB each. {uploadedFiles.length}/10 photos uploaded.
              </p>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
            </div>

            {/* Uploaded Files Grid */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {uploadedPhotos[index] && (
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Continue Button */}
            <Button onClick={handleContinue} className="w-full" disabled={uploadedPhotos.length < 6 || isUploading}>
              {isUploading ? "Uploading..." : `Continue to Checkout (${uploadedPhotos.length}/10 photos)`}
            </Button>

            {uploadedPhotos.length < 6 && (
              <p className="text-sm text-red-500 text-center">Please upload at least 6 photos to continue</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
