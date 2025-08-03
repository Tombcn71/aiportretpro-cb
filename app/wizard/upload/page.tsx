"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Upload, Check } from "lucide-react"
import Image from "next/image"

export default function WizardUpload() {
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedFiles.length + acceptedFiles.length > 10) {
        alert("Maximum 10 foto's toegestaan")
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      const newFiles = [...uploadedFiles, ...acceptedFiles]
      setUploadedFiles(newFiles)

      try {
        const uploadPromises = acceptedFiles.map(async (file, index) => {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}`)
          }

          const data = await response.json()
          setUploadProgress(((index + 1) / acceptedFiles.length) * 100)
          return data.url
        })

        const newUrls = await Promise.all(uploadPromises)
        const allUrls = [...uploadedUrls, ...newUrls]
        setUploadedUrls(allUrls)

        // Save to sessionStorage
        const wizardData = {
          uploadedPhotos: allUrls,
          timestamp: Date.now(),
        }
        sessionStorage.setItem("wizardUploadData", JSON.stringify(wizardData))
      } catch (error) {
        console.error("Upload error:", error)
        alert("Er ging iets mis bij het uploaden. Probeer opnieuw.")
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [uploadedFiles, uploadedUrls],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    disabled: isUploading,
  })

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    const newUrls = uploadedUrls.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    setUploadedUrls(newUrls)

    // Update sessionStorage
    const wizardData = {
      uploadedPhotos: newUrls,
      timestamp: Date.now(),
    }
    sessionStorage.setItem("wizardUploadData", JSON.stringify(wizardData))
  }

  const handleContinue = () => {
    if (uploadedUrls.length < 6) {
      alert("Upload minimaal 6 foto's om door te gaan")
      return
    }

    // Save final data
    const wizardData = {
      uploadedPhotos: uploadedUrls,
      timestamp: Date.now(),
    }
    sessionStorage.setItem("wizardUploadData", JSON.stringify(wizardData))

    router.push("/wizard/review")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Stap 3 van 3</span>
            <span className="text-sm text-gray-500">Upload foto's</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload je foto's</h1>
              <p className="text-gray-600 mb-6">
                Upload minimaal 6 foto's voor de beste resultaten. Zorg voor goede belichting en verschillende hoeken.
              </p>
            </div>

            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? "Laat je foto's hier vallen" : "Sleep foto's hierheen of klik om te selecteren"}
              </p>
              <p className="text-sm text-gray-500">JPG, PNG, WEBP tot 10MB per foto</p>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Uploaden...</span>
                  <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Geüploade foto's ({uploadedFiles.length}/10)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {uploadedUrls[index] ? (
                          <Image
                            src={uploadedUrls[index] || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      {uploadedUrls[index] && (
                        <>
                          <div className="absolute top-2 right-2">
                            <div className="bg-green-500 rounded-full p-1">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 left-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h4 className="font-medium text-blue-900 mb-3">Tips voor de beste resultaten:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload foto's met goede belichting</li>
                <li>• Varieer in hoeken en uitdrukkingen</li>
                <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
                <li>• Vermijd zonnebrillen of petten</li>
              </ul>
            </div>

            {/* Continue Button */}
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => router.back()} disabled={isUploading}>
                Terug
              </Button>
              <Button
                onClick={handleContinue}
                disabled={uploadedUrls.length < 6 || isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Doorgaan naar bestelling ({uploadedUrls.length}/6)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
