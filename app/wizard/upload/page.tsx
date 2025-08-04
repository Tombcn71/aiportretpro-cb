"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Upload, X, Check, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"

export default function WizardUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const router = useRouter()

  useEffect(() => {
    // Load existing data if available
    const savedData = localStorage.getItem("wizardData")
    if (savedData) {
      const data = JSON.parse(savedData)
      if (data.uploadedPhotos) {
        setUploadedUrls(data.uploadedPhotos)
      }
    }
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter((file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024)
    setUploadedFiles((prev) => [...prev, ...newFiles])
    uploadFiles(newFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  })

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true)
    const newUrls: string[] = []

    for (const file of files) {
      try {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const { url } = await response.json()
          newUrls.push(url)
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
        } else {
          console.error("Upload failed for", file.name)
        }
      } catch (error) {
        console.error("Upload error:", error)
      }
    }

    setUploadedUrls((prev) => [...prev, ...newUrls])
    setIsUploading(false)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    setUploadedUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (uploadedUrls.length < 10) return

    // Save data to localStorage
    const existingData = localStorage.getItem("wizardData")
    const data = existingData ? JSON.parse(existingData) : {}

    const updatedData = {
      ...data,
      uploadedPhotos: uploadedUrls,
      step: "upload",
    }

    localStorage.setItem("wizardData", JSON.stringify(updatedData))
    router.push("/wizard/checkout")
  }

  const handleBack = () => {
    router.push("/wizard/gender")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0077B5]">Stap 3 van 3</span>
            <span className="text-sm text-gray-500">Upload Foto's</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#0077B5] h-2 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Upload je foto's</CardTitle>
            <p className="text-gray-600">
              Upload 10-20 foto's voor de beste resultaten. Meer foto's = betere AI portretten.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Upload Status */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                {uploadedUrls.length >= 10 ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                )}
                <span className="font-medium">{uploadedUrls.length} van minimaal 10 foto's geüpload</span>
              </div>
              {uploadedUrls.length >= 10 && <span className="text-green-600 font-medium">Klaar voor training!</span>}
            </div>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-[#0077B5] bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-lg text-[#0077B5]">Sleep je foto's hier...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">Sleep foto's hier of klik om te selecteren</p>
                  <p className="text-sm text-gray-500">JPG, PNG, WebP tot 10MB per foto</p>
                </div>
              )}
            </div>

            {/* Photo Guidelines */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Tips voor de beste resultaten:</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Upload 10-20 foto's van verschillende hoeken</li>
                <li>• Zorg voor goede belichting en scherpte</li>
                <li>• Varieer in gezichtsuitdrukkingen en poses</li>
                <li>• Vermijd zonnebrillen, hoeden of filters</li>
                <li>• Gebruik foto's waar je gezicht duidelijk zichtbaar is</li>
              </ul>
            </div>

            {/* Uploaded Photos Grid */}
            {uploadedUrls.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Geüploade foto's ({uploadedUrls.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {uploadedUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <p className="font-medium">Uploaden...</p>
                {Object.entries(uploadProgress).map(([filename, progress]) => (
                  <div key={filename} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate">{filename}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#0077B5] h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center bg-transparent"
                disabled={isUploading}
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Terug
              </Button>

              <Button
                onClick={handleNext}
                disabled={uploadedUrls.length < 10 || isUploading}
                className="bg-[#0077B5] hover:bg-[#004182] text-white flex items-center"
              >
                Naar Betaling
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
