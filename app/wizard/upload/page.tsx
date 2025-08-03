"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X } from "lucide-react"

export default function UploadPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    if (!projectName || !gender) {
      router.push("/wizard/project-name")
    }
  }, [router])

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (uploadedPhotos.length + files.length > 10) {
        alert("Maximum 10 photos allowed")
        return
      }

      setIsUploading(true)
      const newPhotos: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith("image/")) continue

        const formData = new FormData()
        formData.append("file", file)

        try {
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

      setUploadedPhotos((prev) => [...prev, ...newPhotos])
      setIsUploading(false)
    },
    [uploadedPhotos.length],
  )

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (uploadedPhotos.length < 6) {
      alert("Please upload at least 6 photos")
      return
    }

    setIsLoading(true)

    const sessionId = sessionStorage.getItem("wizardSessionId")
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")

    // Save wizard data
    try {
      await fetch("/api/wizard/save-data", {
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
    } catch (error) {
      console.error("Failed to save wizard data:", error)
    }

    router.push("/wizard/checkout")
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Upload Photos</CardTitle>
          <p className="text-gray-600">Step 3 of 3</p>
          <Progress value={100} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Upload 6-10 high-quality photos of yourself</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">Click to upload photos</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
              </label>
            </div>
          </div>

          {uploadedPhotos.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Uploaded Photos ({uploadedPhotos.length}/10)</h3>
              <div className="grid grid-cols-3 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={uploadedPhotos.length < 6 || isLoading || isUploading}
          >
            {isLoading ? "Processing..." : `Continue with ${uploadedPhotos.length} photos`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
