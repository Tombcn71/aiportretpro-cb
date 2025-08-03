"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, X, Check } from "lucide-react"
import Image from "next/image"

interface WizardData {
  projectName: string
  gender: string
  uploadedPhotos: string[]
  userEmail: string
}

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session")
  const [wizardData, setWizardData] = useState<WizardData | null>(null)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Get wizard data from localStorage
    const savedData = localStorage.getItem(`wizard_${sessionId}`)
    if (savedData) {
      const data = JSON.parse(savedData)
      setWizardData(data)
      if (data.uploadedPhotos) {
        setUploadedPhotos(data.uploadedPhotos)
      }
    } else {
      router.push("/wizard/welcome")
    }
  }, [sessionId, router])

  const saveWizardData = useCallback(
    (photos: string[]) => {
      if (!wizardData || !sessionId) return

      const updatedData = {
        ...wizardData,
        uploadedPhotos: photos,
      }

      localStorage.setItem(`wizard_${sessionId}`, JSON.stringify(updatedData))
      setWizardData(updatedData)
    },
    [wizardData, sessionId],
  )

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    const newPhotos: string[] = []

    for (let i = 0; i < Math.min(files.length, 20 - uploadedPhotos.length); i++) {
      const file = files[i]

      if (!file.type.startsWith("image/")) continue

      try {
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
      } catch (error) {
        console.error("Upload error:", error)
      }
    }

    const updatedPhotos = [...uploadedPhotos, ...newPhotos]
    setUploadedPhotos(updatedPhotos)
    saveWizardData(updatedPhotos)
    setUploading(false)
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updatedPhotos)
    saveWizardData(updatedPhotos)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleContinue = () => {
    if (uploadedPhotos.length >= 4) {
      router.push(`/wizard/review?session=${sessionId}`)
    }
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Gegevens laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.push(`/wizard/gender?session=${sessionId}`)} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload je foto's</h1>
            <p className="text-gray-600">Upload minimaal 4 foto's voor de beste resultaten</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Stap 3 van 3</span>
            <span>Upload foto's</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        {/* Project Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Project:</span>
                <span className="ml-2 font-medium">{wizardData.projectName}</span>
              </div>
              <div>
                <span className="text-gray-600">Geslacht:</span>
                <span className="ml-2 font-medium capitalize">{wizardData.gender}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : uploadedPhotos.length >= 20
                    ? "border-gray-300 bg-gray-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

              {uploadedPhotos.length >= 20 ? (
                <div>
                  <p className="text-lg font-medium text-gray-600 mb-2">Maximum aantal foto's bereikt</p>
                  <p className="text-gray-500">Je hebt 20 foto's geüpload (maximum)</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">Sleep foto's hierheen of klik om te uploaden</p>
                  <p className="text-gray-500 mb-4">Ondersteunde formaten: JPG, PNG, WEBP (max 10MB per foto)</p>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading || uploadedPhotos.length >= 20}
                  />

                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors cursor-pointer ${
                      uploading || uploadedPhotos.length >= 20
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploaden...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Selecteer foto's
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Upload Tips */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload minimaal 4 foto's, maximaal 20</li>
                <li>• Gebruik heldere, goed belichte foto's</li>
                <li>• Varieer in poses en gezichtsuitdrukkingen</li>
                <li>• Zorg dat je gezicht goed zichtbaar is</li>
                <li>• Vermijd zonnebrillen of petten</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Photos Grid */}
        {uploadedPhotos.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Geüploade foto's ({uploadedPhotos.length}/20)</h3>
                {uploadedPhotos.length >= 4 && (
                  <div className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Klaar om door te gaan</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={uploadedPhotos.length < 4}
            className="px-8 py-3 text-lg font-semibold"
          >
            {uploadedPhotos.length < 4 ? `Upload nog ${4 - uploadedPhotos.length} foto's` : "Doorgaan naar bestelling"}
          </Button>
        </div>
      </div>
    </div>
  )
}
