"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Upload, X, Check } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to welcome")
      router.push("/wizard/welcome")
      return
    }

    // Check if previous steps are completed
    const projectName = sessionStorage.getItem("projectName")
    const gender = sessionStorage.getItem("gender")

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
    const savedPhotos = sessionStorage.getItem("uploadedPhotos")
    if (savedPhotos) {
      setUploadedPhotos(JSON.parse(savedPhotos))
    }
  }, [session, status, router])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        if (uploadedPhotos.length >= 20) break

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setUploadedPhotos((prev) => {
            const newPhotos = [...prev, data.url]
            sessionStorage.setItem("uploadedPhotos", JSON.stringify(newPhotos))
            return newPhotos
          })
        }
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Er ging iets mis bij het uploaden. Probeer opnieuw.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(newPhotos)
    sessionStorage.setItem("uploadedPhotos", JSON.stringify(newPhotos))
  }

  const handleNext = () => {
    if (uploadedPhotos.length >= 6) {
      console.log("🚀 Going to review page")
      router.push("/wizard/review")
    }
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
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={3} totalSteps={3} />
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Upload je foto's</CardTitle>
            <p className="text-gray-600">
              Upload minimaal 6 foto's van jezelf. Meer foto's = betere resultaten (max 20).
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Sleep foto's hierheen of klik om te selecteren</p>
                <p className="text-sm text-gray-500">JPG, PNG tot 10MB per foto</p>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || uploadedPhotos.length >= 20}
                className="mt-4 bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                {uploading ? "Uploaden..." : "Selecteer foto's"}
              </Button>
            </div>

            {/* Photo Grid */}
            {uploadedPhotos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Geüploade foto's ({uploadedPhotos.length}/20)</h3>
                  {uploadedPhotos.length >= 6 && (
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-sm">Klaar om door te gaan</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Gebruik foto's waar je gezicht duidelijk zichtbaar is</li>
                <li>• Varieer in poses en uitdrukkingen</li>
                <li>• Zorg voor goede belichting</li>
                <li>• Vermijd zonnebrillen of petten</li>
              </ul>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/wizard/gender")} className="text-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={uploadedPhotos.length < 6}
                className="bg-[#0077B5] hover:bg-[#004182] text-white"
              >
                Volgende stap
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
