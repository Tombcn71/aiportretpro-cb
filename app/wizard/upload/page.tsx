"use client"

import type React from "react"

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
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/wizard/welcome")
      return
    }

    // Check previous steps
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

    // Load saved uploads
    const saved = localStorage.getItem("wizard_uploaded_photos")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setUploadedUrls(parsed)
        }
      } catch (error) {
        console.error("Error parsing saved URLs:", error)
      }
    }
  }, [session, status, router])

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files)
      const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length === 0) {
        alert("Selecteer alleen afbeeldingen")
        return
      }

      if (uploadedUrls.length + imageFiles.length > 10) {
        alert("Je kunt maximaal 10 foto's uploaden")
        return
      }

      setUploading(true)

      try {
        const newUrls: string[] = []

        for (const file of imageFiles) {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            newUrls.push(data.url)
          } else {
            console.error("Upload failed for file:", file.name)
          }
        }

        const updatedUrls = [...uploadedUrls, ...newUrls]
        setUploadedUrls(updatedUrls)
        localStorage.setItem("wizard_uploaded_photos", JSON.stringify(updatedUrls))
      } catch (error) {
        console.error("Upload error:", error)
        alert("Er ging iets mis bij het uploaden. Probeer het opnieuw.")
      } finally {
        setUploading(false)
      }
    },
    [uploadedUrls],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileSelect(files)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeFile = (index: number) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index)
    setUploadedUrls(newUrls)
    localStorage.setItem("wizard_uploaded_photos", JSON.stringify(newUrls))
  }

  const handleNext = () => {
    if (uploadedUrls.length < 6) {
      alert("Upload minimaal 6 foto's voor de beste resultaten")
      return
    }

    setLoading(true)
    router.push("/wizard/checkout")
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
        <div className="mb-8">
          <ProgressBar currentStep={3} totalSteps={4} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Upload je foto's</CardTitle>
            <p className="text-gray-600">Upload 6-10 foto's van jezelf voor de beste AI training resultaten</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0077B5] transition-colors"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Sleep foto's hierheen of klik om te selecteren</p>
                <p className="text-sm text-gray-500">PNG, JPG tot 10MB per foto</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mt-4 inline-block bg-[#0077B5] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-[#004182] transition-colors"
              >
                Selecteer Foto's
              </label>
            </div>

            {/* Upload status */}
            {uploading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0077B5] mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Foto's uploaden...</p>
              </div>
            )}

            {/* Uploaded photos grid */}
            {uploadedUrls.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Geüploade foto's ({uploadedUrls.length}/10)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={url || "/placeholder.svg"}
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
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-[#0077B5] mb-2">💡 Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Upload foto's met goede belichting</li>
                <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
                <li>• Gebruik verschillende hoeken en uitdrukkingen</li>
                <li>• Vermijd groepsfoto's</li>
                <li>• Minimaal 6 foto's, maximaal 10 voor beste resultaten</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/gender")} disabled={loading || uploading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={uploadedUrls.length < 6 || loading || uploading}
                className="bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                {loading ? "Bezig..." : "Naar Betaling"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
