"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Upload, X, Camera, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function WizardUpload() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/wizard/upload")
      return
    }

    // Check if we have a wizard session
    const sessionId = localStorage.getItem("wizardSessionId")
    if (!sessionId) {
      router.push("/wizard/welcome")
      return
    }

    // Load existing data if any
    const savedData = localStorage.getItem(`wizard_${sessionId}`)
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.uploadedPhotos) {
        setUploadedUrls(data.uploadedPhotos)
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

  const handleFiles = async (files: File[]) => {
    if (uploadedFiles.length + files.length > 10) {
      alert("Je kunt maximaal 10 foto's uploaden")
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
        }
      }

      setUploadedFiles((prev) => [...prev, ...files])
      setUploadedUrls((prev) => [...prev, ...newUrls])

      // Save to localStorage
      const sessionId = localStorage.getItem("wizardSessionId")
      if (sessionId) {
        const existingData = localStorage.getItem(`wizard_${sessionId}`)
        const wizardData = existingData ? JSON.parse(existingData) : {}
        wizardData.uploadedPhotos = [...uploadedUrls, ...newUrls]
        localStorage.setItem(`wizard_${sessionId}`, JSON.stringify(wizardData))
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Er ging iets mis bij het uploaden. Probeer opnieuw.")
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    const newUrls = uploadedUrls.filter((_, i) => i !== index)

    setUploadedFiles(newFiles)
    setUploadedUrls(newUrls)

    // Update localStorage
    const sessionId = localStorage.getItem("wizardSessionId")
    if (sessionId) {
      const existingData = localStorage.getItem(`wizard_${sessionId}`)
      const wizardData = existingData ? JSON.parse(existingData) : {}
      wizardData.uploadedPhotos = newUrls
      localStorage.setItem(`wizard_${sessionId}`, JSON.stringify(wizardData))
    }
  }

  const handleNext = async () => {
    if (uploadedUrls.length < 4) {
      alert("Upload minimaal 4 foto's voor de beste resultaten")
      return
    }

    setIsLoading(true)

    try {
      const sessionId = localStorage.getItem("wizardSessionId")
      if (!sessionId) {
        router.push("/wizard/welcome")
        return
      }

      // Save to localStorage
      const existingData = localStorage.getItem(`wizard_${sessionId}`)
      const wizardData = existingData ? JSON.parse(existingData) : {}
      wizardData.uploadedPhotos = uploadedUrls
      wizardData.userEmail = session?.user?.email
      localStorage.setItem(`wizard_${sessionId}`, JSON.stringify(wizardData))

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          uploadedPhotos: uploadedUrls,
          userEmail: session?.user?.email,
          ...wizardData,
        }),
      })

      router.push("/wizard/checkout")
    } catch (error) {
      console.error("Error saving photos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/gender")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={handleBack} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex space-x-2">
                <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
                <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
                <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <div className="w-8"></div>
            </div>

            <CardTitle className="text-2xl font-bold text-center text-gray-900">Stap 3: Upload Je Foto's</CardTitle>
            <p className="text-center text-gray-600">Upload 4-10 foto's van jezelf voor de beste AI-resultaten</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-orange-600" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sleep foto's hierheen of klik om te uploaden</h3>
                  <p className="text-gray-600">Ondersteunde formaten: JPG, PNG, WEBP (max 10MB per foto)</p>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length > 0) {
                      handleFiles(files)
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                />

                <Button
                  onClick={() => document.getElementById("file-upload")?.click()}
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                  disabled={isUploading}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploaden..." : "Selecteer Foto's"}
                </Button>
              </div>
            </div>

            {/* Photo Grid */}
            {uploadedUrls.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Geüploade Foto's ({uploadedUrls.length}/10)</h3>
                  {uploadedUrls.length >= 4 && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Klaar voor AI training!</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">📸 Tips voor perfecte foto's:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gebruik foto's met goede belichting (natuurlijk licht is het beste)</li>
                <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
                <li>• Varieer in hoeken: rechtdoor, licht naar links/rechts</li>
                <li>• Vermijd zonnebrillen, petten of schaduwen op je gezicht</li>
                <li>• Upload foto's van alleen jezelf (geen groepsfoto's)</li>
              </ul>
            </div>

            {/* Progress indicator */}
            {uploadedUrls.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Voortgang</span>
                  <span className="text-gray-600">{uploadedUrls.length}/4 minimum</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((uploadedUrls.length / 4) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={uploadedUrls.length < 4 || isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Opslaan...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Ga naar Betaling</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
