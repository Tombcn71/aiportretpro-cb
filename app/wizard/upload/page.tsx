"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Check } from "lucide-react"
import Image from "next/image"

export default function UploadPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [gender, setGender] = useState("")

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    // Check if we have data from previous steps
    const savedProjectName = localStorage.getItem("wizard_project_name")
    const savedGender = localStorage.getItem("wizard_gender")

    if (!savedProjectName || !savedGender) {
      router.push("/wizard/project-name")
      return
    }

    setProjectName(savedProjectName)
    setGender(savedGender)

    // Clear any old uploaded photos
    localStorage.removeItem("wizard_uploaded_photos")

    console.log("📋 Loaded wizard data:", { projectName: savedProjectName, gender: savedGender })
  }, [session, router])

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return

      setIsUploading(true)
      const newPhotos: string[] = []

      try {
        for (let i = 0; i < Math.min(files.length, 10); i++) {
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

        const updatedPhotos = [...uploadedPhotos, ...newPhotos].slice(0, 10)
        setUploadedPhotos(updatedPhotos)

        // Save to localStorage immediately
        localStorage.setItem("wizard_uploaded_photos", JSON.stringify(updatedPhotos))
        console.log("💾 Saved uploaded photos:", updatedPhotos.length)
      } catch (error) {
        console.error("Upload error:", error)
      } finally {
        setIsUploading(false)
      }
    },
    [uploadedPhotos],
  )

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updatedPhotos)
    localStorage.setItem("wizard_uploaded_photos", JSON.stringify(updatedPhotos))
    console.log("🗑️ Removed photo, remaining:", updatedPhotos.length)
  }

  const handleNext = () => {
    if (uploadedPhotos.length < 4) return

    console.log("✅ All wizard data ready:", {
      projectName,
      gender,
      photosCount: uploadedPhotos.length,
    })

    router.push("/wizard/checkout")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/wizard/gender")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <div className="flex space-x-2">
                  <div className="h-2 bg-blue-600 rounded-full flex-1"></div>
                  <div className="h-2 bg-blue-600 rounded-full flex-1"></div>
                  <div className="h-2 bg-blue-600 rounded-full flex-1"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Step 3 of 3</p>
              </div>
            </div>
            <CardTitle className="text-2xl">Upload your photos</CardTitle>
            <p className="text-gray-600">Upload 4-10 high-quality photos of yourself for the best results</p>
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
                disabled={isUploading || uploadedPhotos.length >= 10}
              />
              <label
                htmlFor="photo-upload"
                className={`cursor-pointer ${isUploading || uploadedPhotos.length >= 10 ? "opacity-50" : ""}`}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">{isUploading ? "Uploading..." : "Click to upload photos"}</p>
                <p className="text-gray-500">{uploadedPhotos.length}/10 photos uploaded</p>
              </label>
            </div>

            {/* Photo Grid */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden">
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
            )}

            {/* Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Photo Requirements:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Clear, well-lit photos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Face clearly visible
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Different angles and expressions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  High resolution (minimum 512x512)
                </li>
              </ul>
            </div>

            <Button onClick={handleNext} disabled={uploadedPhotos.length < 4} className="w-full">
              Continue to Checkout ({uploadedPhotos.length}/4 minimum)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
