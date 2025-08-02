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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log("🔍 Upload page - Session status:", status)

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

    console.log("✅ Previous steps completed, staying on upload page")

    // Load existing uploads if available
    const savedUrls = localStorage.getItem("wizard_uploaded_photos")
    if (savedUrls) {
      try {
        const urls = JSON.parse(savedUrls)
        setUploadedUrls(urls)
        console.log("📝 Loaded saved photos:", urls.length)
      } catch (error) {
        console.error("Error loading saved photos:", error)
      }
    }
  }, [session, status, router])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...imageFiles].slice(0, 10)) // Max 10 files
    }
  }, [])

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of uploadedFiles) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          newUrls.push(data.url)
          console.log("✅ Uploaded file:", data.url)
        } else {
          console.error("❌ Upload failed for file:", file.name)
        }
      }

      // Update state and localStorage
      const allUrls = [...uploadedUrls, ...newUrls]
      setUploadedUrls(allUrls)
      localStorage.setItem("wizard_uploaded_photos", JSON.stringify(allUrls))
      setUploadedFiles([]) // Clear uploaded files

      console.log("💾 Saved all photos:", allUrls.length)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeUploadedPhoto = (index: number) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index)
    setUploadedUrls(newUrls)
    localStorage.setItem("wizard_uploaded_photos", JSON.stringify(newUrls))
  }

  const handleNext = () => {
    if (uploadedUrls.length < 6) return

    setLoading(true)
    console.log("🚀 Proceeding to checkout with", uploadedUrls.length, "photos")
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

  const totalPhotos = uploadedUrls.length
  const canProceed = totalPhotos >= 6

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
              Upload 6-10 foto's van jezelf. Zorg voor goede kwaliteit en verschillende hoeken.
            </p>
            <div className="mt-4">
              <span className={`text-lg font-semibold ${canProceed ? "text-green-600" : "text-gray-600"}`}>
                {totalPhotos}/10 foto's geüpload
              </span>
              {canProceed && <Check className="inline ml-2 h-5 w-5 text-green-600" />}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Klik om foto's te selecteren</p>
                <p className="text-sm text-gray-500">Of sleep foto's hierheen. JPG, PNG tot 10MB per foto.</p>
              </label>
            </div>

            {/* Selected Files (not yet uploaded) */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Geselecteerde foto's ({uploadedFiles.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Selected ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {uploading ? "Uploaden..." : `Upload ${uploadedFiles.length} foto's`}
                </Button>
              </div>
            )}

            {/* Uploaded Photos */}
            {uploadedUrls.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Geüploade foto's ({uploadedUrls.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Uploaded ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeUploadedPhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload minimaal 6 foto's, maximaal 10</li>
                <li>• Gebruik foto's met goede belichting</li>
                <li>• Varieer in hoeken en uitdrukkingen</li>
                <li>• Zorg dat je gezicht goed zichtbaar is</li>
                <li>• Vermijd zonnebrillen of petten</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/gender")} disabled={loading}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed || loading}
                className="bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                {loading ? "Bezig..." : "Naar betaling"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
