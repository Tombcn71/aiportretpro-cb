"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Upload, X, Check } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"
import Image from "next/image"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Check if previous steps are completed
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")

    if (!projectName) {
      console.log("❌ No project name, redirecting to project-name")
      router.push("/wizard/project-name")
      return
    }

    if (!gender) {
      console.log("❌ No gender, redirecting to gender")
      router.push("/wizard/gender")
      return
    }

    // Load existing photos if available
    const savedPhotos = localStorage.getItem("wizard_uploaded_photos")
    if (savedPhotos) {
      try {
        const photos = JSON.parse(savedPhotos)
        setUploadedPhotos(photos)
      } catch (error) {
        console.error("Error parsing saved photos:", error)
      }
    }

    console.log("✅ Upload page loaded")
  }, [session, status, router])

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return

      setUploading(true)

      try {
        const newPhotoUrls: string[] = []

        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          if (!file.type.startsWith("image/")) {
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
            newPhotoUrls.push(data.url)
          }
        }

        const updatedPhotos = [...uploadedPhotos, ...newPhotoUrls].slice(0, 10) // Max 10 photos
        setUploadedPhotos(updatedPhotos)

        // Save to localStorage
        localStorage.setItem("wizard_uploaded_photos", JSON.stringify(updatedPhotos))

        console.log("✅ Photos uploaded:", updatedPhotos.length)
      } catch (error) {
        console.error("Upload error:", error)
      } finally {
        setUploading(false)
      }
    },
    [uploadedPhotos],
  )

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updatedPhotos)
    localStorage.setItem("wizard_uploaded_photos", JSON.stringify(updatedPhotos))
  }

  const handleNext = () => {
    if (uploadedPhotos.length < 6) return

    setLoading(true)
    console.log("✅ Moving to checkout with", uploadedPhotos.length, "photos")
    router.push("/wizard/checkout")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          <ProgressBar currentStep={3} totalSteps={4} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Upload je foto's</CardTitle>
            <p className="text-gray-600">
              Upload 6-10 foto's van jezelf. Zorg voor goede belichting en verschillende hoeken.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
                disabled={uploading || uploadedPhotos.length >= 10}
              />

              <label
                htmlFor="photo-upload"
                className={`cursor-pointer ${uploading || uploadedPhotos.length >= 10 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {uploading ? "Uploaden..." : "Klik om foto's te selecteren"}
                </p>
                <p className="text-sm text-gray-500">JPG, PNG tot 10MB per foto. {uploadedPhotos.length}/10 foto's</p>
              </label>
            </div>

            {/* Photo Grid */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedPhotos.map((photoUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={photoUrl || "/placeholder.svg"}
                        alt={`Uploaded photo ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Tips voor de beste resultaten:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Goede belichting (natuurlijk licht werkt het best)
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Verschillende hoeken en uitdrukkingen
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Duidelijk zichtbaar gezicht
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Minimaal 6 foto's voor beste resultaat
                </li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/gender")} disabled={loading || uploading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={uploadedPhotos.length < 6 || loading || uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Naar betaling ({uploadedPhotos.length} foto's)
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
