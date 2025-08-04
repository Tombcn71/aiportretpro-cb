"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"

export default function WizardUpload() {
  const { data: session } = useSession()
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [wizardData, setWizardData] = useState<any>(null)

  useEffect(() => {
    // Load existing wizard data
    const saved = localStorage.getItem("wizardData")
    if (saved) {
      const data = JSON.parse(saved)
      setWizardData(data)
    } else {
      // No wizard data found, redirect to start
      router.push("/wizard/welcome")
    }
  }, [router])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"))
      const newFiles = [...uploadedFiles, ...imageFiles].slice(0, 10) // Max 10 files
      setUploadedFiles(newFiles)
    },
    [uploadedFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    maxFiles: 10,
  })

  const removeFile = (index: number) => {
    setUploadedFiles((files) => files.filter((_, i) => i !== index))
  }

  const handleNext = async () => {
    if (uploadedFiles.length < 4) return

    setIsLoading(true)
    try {
      // Upload files first
      const uploadPromises = uploadedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")
        return response.json()
      })

      const uploadResults = await Promise.all(uploadPromises)
      const imageUrls = uploadResults.map((result) => result.url)

      const updatedData = {
        ...wizardData,
        images: imageUrls,
        step: 3,
      }

      localStorage.setItem("wizardData", JSON.stringify(updatedData))

      // Save to database
      await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })

      router.push("/wizard/checkout")
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Er ging iets mis bij het uploaden. Probeer het opnieuw.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/gender")
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-600">Stap 3 van 3</span>
            <span className="text-sm text-gray-500">Foto Upload</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Upload je foto's</CardTitle>
            <p className="text-gray-600 mt-2">Upload 4-10 foto's van jezelf voor de beste resultaten</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-orange-600 font-medium">Laat je foto's hier vallen...</p>
              ) : (
                <div>
                  <p className="text-gray-600 font-medium mb-2">Sleep foto's hierheen of klik om te selecteren</p>
                  <p className="text-sm text-gray-500">JPG, PNG, WEBP tot 10MB per foto</p>
                </div>
              )}
            </div>

            {/* File Counter */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{uploadedFiles.length} van 10 foto's geüpload</span>
              <div className="flex items-center space-x-2">
                {uploadedFiles.length >= 4 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Genoeg foto's</span>
                  </div>
                ) : (
                  <div className="flex items-center text-orange-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Minimaal {4 - uploadedFiles.length} foto's meer</span>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Files Grid */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📸 Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Gebruik foto's waar je gezicht duidelijk zichtbaar is</li>
                <li>• Varieer in hoeken, uitdrukkingen en belichting</li>
                <li>• Vermijd zonnebrillen, hoeden of andere gezichtsbedekking</li>
                <li>• Hoge kwaliteit foto's geven betere resultaten</li>
              </ul>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack} className="flex items-center bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={uploadedFiles.length < 4 || isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploaden...
                  </>
                ) : (
                  <>
                    Naar Betaling
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
