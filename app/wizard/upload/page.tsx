"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Upload, X } from "lucide-react"
import Image from "next/image"

export default function WizardUploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Check if previous steps are completed
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")

    if (!projectName) {
      router.push("/wizard/project-name")
      return
    }

    if (!gender) {
      router.push("/wizard/gender")
      return
    }

    // Load existing photos if available
    const existingPhotos = localStorage.getItem("wizard_uploaded_photos")
    if (existingPhotos) {
      try {
        const parsedPhotos = JSON.parse(existingPhotos)
        if (Array.isArray(parsedPhotos)) {
          setUploadedPhotos(parsedPhotos)
        }
      } catch (error) {
        console.error("Error parsing existing photos:", error)
      }
    }
  }, [session, status, router])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        return data.url
      })

      const newUrls = await Promise.all(uploadPromises)
      const updatedPhotos = [...uploadedPhotos, ...newUrls]

      setUploadedPhotos(updatedPhotos)
      localStorage.setItem("wizard_uploaded_photos", JSON.stringify(updatedPhotos))
    } catch (error) {
      console.error("Upload error:", error)
      alert("Er is een fout opgetreden bij het uploaden. Probeer het opnieuw.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removePhoto = (indexToRemove: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, index) => index !== indexToRemove)
    setUploadedPhotos(updatedPhotos)
    localStorage.setItem("wizard_uploaded_photos", JSON.stringify(updatedPhotos))
  }

  const handleContinue = () => {
    if (uploadedPhotos.length === 0) return

    setLoading(true)
    router.push("/wizard/checkout")
  }

  const handleBack = () => {
    router.push("/wizard/gender")
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
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Upload je foto's</CardTitle>
            <p className="text-gray-600 mt-2">Upload minimaal 4 foto's voor de beste resultaten</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#0077B5] transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700">
                {uploading ? "Uploading..." : "Klik om foto's te selecteren"}
              </p>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG of WEBP bestanden (max 10MB per foto)</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />

            {/* Uploaded photos grid */}
            {uploadedPhotos.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Geüploade foto's ({uploadedPhotos.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedPhotos.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Uploaded photo ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
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

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload minimaal 4-6 foto's</li>
                <li>• Gebruik foto's met goede belichting</li>
                <li>• Varieer in poses en uitdrukkingen</li>
                <li>• Zorg dat je gezicht goed zichtbaar is</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleBack} variant="outline" className="flex-1 bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleContinue}
                disabled={uploadedPhotos.length === 0 || loading}
                className="flex-1 bg-[#0077B5] hover:bg-[#005885] text-white"
              >
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    Doorgaan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-8 h-1 bg-[#0077B5] rounded"></div>
                <div className="w-8 h-1 bg-[#0077B5] rounded"></div>
                <div className="w-8 h-1 bg-[#0077B5] rounded"></div>
                <div className="w-8 h-1 bg-gray-300 rounded"></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Stap 3 van 4</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
