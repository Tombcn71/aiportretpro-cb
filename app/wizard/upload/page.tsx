"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Upload, X, Trash2 } from "lucide-react"
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Aragon.ai logo and progress */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">Aragon.ai</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full bg-gray-200 h-2">
          <div className="bg-orange-500 h-2 transition-all duration-300" style={{ width: "75%" }}></div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Left sidebar with instructions */}
        <div className="w-1/3 p-6 bg-gray-50">
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">
                of close-ups, selfies and mid-range shots can help the AI better capture your face and body type.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <div className="w-8 h-8 bg-gray-800 rounded mx-auto mb-2 flex items-center justify-center">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Upload from your computer</h3>
                </div>

                <Button
                  onClick={() => document.getElementById("file-input")?.click()}
                  disabled={isUploading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg mb-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload files
                </Button>

                <p className="text-sm text-gray-600">
                  or <span className="text-orange-500 font-medium">drag and drop</span> your photos
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, HEIC, WEBP up to 120MB</p>

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

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <div className="w-8 h-8 bg-gray-800 rounded mx-auto mb-2 flex items-center justify-center">
                    <span className="text-white text-xs">📱</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Or upload from your mobile</h3>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <p className="font-medium mb-2">Scan the QR code</p>
                  <div className="w-16 h-16 bg-black mx-auto rounded">
                    {/* QR code placeholder */}
                    <div className="w-full h-full bg-black rounded flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side with uploaded images */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Uploaded Images</h2>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold">{uploadedPhotos.length}</span>
                <span className="text-gray-500">{uploadedPhotos.length} of 10</span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((uploadedPhotos.length / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Photo Grid */}
          {uploadedPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                    className="absolute top-2 right-2 bg-white text-gray-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 border-t bg-white">
        <Button
          onClick={handleNext}
          disabled={uploadedPhotos.length < 4 || isLoading}
          className="w-full py-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          {isLoading ? "Bezig..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}
