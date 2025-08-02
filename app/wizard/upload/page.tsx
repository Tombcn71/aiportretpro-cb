"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"
import Image from "next/image"

export default function UploadPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    // Get wizard data from localStorage
    const data = localStorage.getItem("wizardData")
    if (data) {
      setWizardData(JSON.parse(data))
    } else {
      // No wizard data, redirect to start
      router.push("/wizard/welcome")
    }
  }, [router])

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
    const newFiles = files.slice(0, 10 - uploadedFiles.length)
    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Upload files
    for (const file of newFiles) {
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const { url } = await response.json()
          setUploadedUrls((prev) => [...prev, url])
        }
      } catch (error) {
        console.error("Upload error:", error)
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    if (uploadedUrls.length < 6) {
      alert("Upload minimaal 6 foto's voor de beste resultaten")
      return
    }

    // Save uploaded photos to wizard data
    const updatedWizardData = {
      ...wizardData,
      uploadedPhotos: uploadedUrls,
    }

    localStorage.setItem("wizardData", JSON.stringify(updatedWizardData))

    // Go to checkout
    router.push("/wizard/checkout")
  }

  const handleBack = () => {
    router.back()
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={4} totalSteps={4} />
        </div>

        {/* Upload Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Upload je foto's</CardTitle>
            <p className="text-gray-600">
              Upload 6-10 foto's van jezelf voor de beste AI training. Zorg voor goede belichting en verschillende
              hoeken.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-[#0077B5] bg-blue-50"
                  : uploadedFiles.length >= 10
                    ? "border-gray-200 bg-gray-50"
                    : "border-gray-300 hover:border-[#0077B5] hover:bg-blue-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {uploadedFiles.length >= 10 ? "Maximum bereikt" : "Sleep foto's hierheen"}
              </h3>
              <p className="text-gray-600 mb-4">
                {uploadedFiles.length >= 10
                  ? "Je hebt het maximum van 10 foto's bereikt"
                  : "Of klik om foto's te selecteren"}
              </p>
              {uploadedFiles.length < 10 && (
                <Button variant="outline" asChild>
                  <label className="cursor-pointer">
                    Selecteer foto's
                    <input type="file" multiple accept="image/*" onChange={handleFileInput} className="hidden" />
                  </label>
                </Button>
              )}
            </div>

            {/* Upload Status */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{uploadedFiles.length}/10 foto's geüpload</span>
              <div className="flex items-center">
                {uploadedFiles.length >= 6 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Genoeg foto's</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>Minimaal {6 - uploadedFiles.length} meer foto's</span>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Photos Grid */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">💡 Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Upload foto's met goede belichting (geen donkere foto's)</li>
                <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
                <li>• Gebruik verschillende hoeken en uitdrukkingen</li>
                <li>• Vermijd groepsfoto's of foto's met andere mensen</li>
                <li>• Selfies en close-ups werken het beste</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={loading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vorige
          </Button>

          <Button
            onClick={handleContinue}
            disabled={loading || uploadedFiles.length < 6}
            className="bg-[#0077B5] hover:bg-[#004182] text-white"
          >
            {loading ? "Bezig..." : "Naar betaling"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
