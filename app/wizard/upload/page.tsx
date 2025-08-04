"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Upload, X, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function WizardUpload() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login?callbackUrl=/wizard/upload")
      return
    }

    // Load saved photos from localStorage
    const savedUrls = localStorage.getItem("wizard_uploaded_photos")
    if (savedUrls) {
      try {
        setUploadedUrls(JSON.parse(savedUrls))
      } catch (error) {
        console.error("Error loading saved photos:", error)
      }
    }
  }, [session, status, router])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

    if (files.length > 0) {
      handleFiles(files)
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    if (uploadedFiles.length + files.length > 20) {
      alert("Je kunt maximaal 20 foto's uploaden")
      return
    }

    setIsUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of files) {
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

      const updatedFiles = [...uploadedFiles, ...files]
      const updatedUrls = [...uploadedUrls, ...newUrls]

      setUploadedFiles(updatedFiles)
      setUploadedUrls(updatedUrls)

      // Save to localStorage
      localStorage.setItem("wizard_uploaded_photos", JSON.stringify(updatedUrls))
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Er ging iets mis bij het uploaden. Probeer het opnieuw.")
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    const newUrls = uploadedUrls.filter((_, i) => i !== index)

    setUploadedFiles(newFiles)
    setUploadedUrls(newUrls)

    localStorage.setItem("wizard_uploaded_photos", JSON.stringify(newUrls))
  }

  const handleContinue = async () => {
    if (uploadedUrls.length < 6) {
      alert("Upload minimaal 6 foto's voor het beste resultaat")
      return
    }

    setIsLoading(true)

    try {
      // Save all wizard data to localStorage
      const wizardData = {
        projectName: localStorage.getItem("wizard_project_name"),
        gender: localStorage.getItem("wizard_gender"),
        uploadedPhotos: uploadedUrls,
      }

      localStorage.setItem("wizard_data", JSON.stringify(wizardData))

      // Navigate to checkout
      router.push("/wizard/checkout")
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Er ging iets mis. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Upload je foto's</CardTitle>
            <p className="text-gray-600">Upload minimaal 6 foto's voor het beste resultaat (max 20)</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-[#0077B5] bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-2">Sleep foto's hierheen of klik om te uploaden</p>
              <p className="text-gray-600 mb-4">Ondersteunde formaten: JPG, PNG, WEBP</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Selecteer Foto's
                </label>
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#0077B5] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tips voor de beste resultaten:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Upload foto's met goede belichting</li>
                    <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
                    <li>• Gebruik verschillende poses en achtergronden</li>
                    <li>• Vermijd groepsfoto's of foto's met zonnebrillen</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Uploaded Photos Grid */}
            {uploadedUrls.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Geüploade foto's ({uploadedUrls.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {uploadedUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isUploading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5] mx-auto mb-2"></div>
                <p className="text-gray-600">Foto's uploaden...</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/wizard/gender">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Terug
                </Link>
              </Button>

              <Button
                onClick={handleContinue}
                disabled={uploadedUrls.length < 6 || isLoading}
                className="flex-1 bg-[#FF8C00] hover:bg-[#FFA500] text-white"
              >
                {isLoading ? "Bezig..." : "Naar Betaling"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Stap 3 van 3</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-[#0077B5] h-2 rounded-full w-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
