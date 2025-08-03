"use client"

import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Check if previous steps are completed
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")
    const wizardSessionId = sessionStorage.getItem("wizardSessionId")

    if (!projectName || !gender || !wizardSessionId) {
      console.log("❌ Missing wizard data, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Load existing photos if available
    const savedPhotos = JSON.parse(sessionStorage.getItem("uploadedPhotos") || "[]")
    if (savedPhotos.length > 0) {
      setUploadedPhotos(savedPhotos)
    }
  }, [session, status, router])

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
    console.log("✅ Photos saved, going to review")
    router.push("/wizard/review")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={3} totalSteps={3} />
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

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => router.push("/wizard/gender")} className="text-gray-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug
          </Button>

          <Button
            onClick={handleContinue}
            disabled={uploadedPhotos.length < 6 || uploading}
            className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-3 text-lg font-semibold"
          >
            Doorgaan naar Review
          </Button>
        </div>
      </div>
    </div>
  )
}
