"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Check } from "lucide-react"
import Image from "next/image"

export default function UploadPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

    // Load existing photos from sessionStorage
    const savedPhotos = sessionStorage.getItem("wizard_uploadedPhotos")
    if (savedPhotos) {
      try {
        setUploadedPhotos(JSON.parse(savedPhotos))
      } catch (error) {
        console.error("Error parsing saved photos:", error)
      }
    }
  }, [session, router])

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newPhotos: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check file type
        if (!file.type.startsWith("image/")) {
          continue
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          continue
        }

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
      }

      const updatedPhotos = [...uploadedPhotos, ...newPhotos]
      setUploadedPhotos(updatedPhotos)
      sessionStorage.setItem("wizard_uploadedPhotos", JSON.stringify(updatedPhotos))
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updatedPhotos)
    sessionStorage.setItem("wizard_uploadedPhotos", JSON.stringify(updatedPhotos))
  }

  const handleNext = async () => {
    if (uploadedPhotos.length < 4) return

    setIsLoading(true)

    try {
      // Navigate to review
      router.push("/wizard/review")
    } catch (error) {
      console.error("Error proceeding to review:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Upload je foto's</CardTitle>
          <Progress value={75} className="w-full mt-4" style={{ backgroundColor: "#e5e7eb" }}>
            <div
              className="h-full transition-all duration-300 ease-in-out rounded-full"
              style={{
                width: "75%",
                backgroundColor: "#0077B5",
              }}
            />
          </Progress>
          <p className="text-sm text-gray-600 mt-2">Stap 3 van 4</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Upload minimaal 4 foto's voor de beste resultaten. Maximaal 10MB per foto.
            </p>
            <p className="text-xs text-gray-500 mb-6">{uploadedPhotos.length}/10 foto's geüpload</p>
          </div>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isUploading ? "Uploaden..." : "Klik om foto's te selecteren"}
            </p>
            <p className="text-sm text-gray-500">Of sleep foto's hierheen</p>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              disabled={isUploading}
            />
          </div>

          {/* Photo Grid */}
          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleNext}
            disabled={uploadedPhotos.length < 4 || isLoading}
            className="w-full"
            style={{ backgroundColor: "#0077B5" }}
          >
            {isLoading ? "Bezig..." : `Volgende (${uploadedPhotos.length}/4 minimum)`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
