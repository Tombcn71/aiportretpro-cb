"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

export default function UploadPage() {
  const router = useRouter()
  const [wizardData, setWizardData] = useState<any>(null)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("wizardData")
    if (stored) {
      const data = JSON.parse(stored)
      setWizardData(data)
      if (data.uploadedPhotos) {
        setUploadedPhotos(data.uploadedPhotos)
      }
    } else {
      router.push("/wizard/project-name")
    }
  }, [router])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    const newPhotos: string[] = []

    for (const file of acceptedFiles) {
      try {
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
      } catch (error) {
        console.error("Upload error:", error)
      }
    }

    setUploadedPhotos((prev) => [...prev, ...newPhotos])
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
  })

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (!wizardData || uploadedPhotos.length < 6) return

    const updatedData = { ...wizardData, uploadedPhotos }
    sessionStorage.setItem("wizardData", JSON.stringify(updatedData))

    router.push("/wizard/review")
  }

  if (!wizardData) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Stap 3: Upload Foto's (minimaal 6)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>Sleep foto's hier of klik om te selecteren</p>
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-600">{uploadedPhotos.length}/6 foto's geüpload</p>

            <Button onClick={handleNext} disabled={uploadedPhotos.length < 6 || uploading} className="w-full">
              {uploading ? "Uploaden..." : "Naar Review"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
