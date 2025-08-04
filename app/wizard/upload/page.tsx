"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Upload, X, Check } from "lucide-react"
import Image from "next/image"

interface UploadedFile {
  file: File
  preview: string
  status: "uploading" | "success" | "error"
  progress: number
}

export default function WizardUploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/wizard/login")
    }
  }, [status, router])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "uploading" as const,
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Upload each file
    for (let i = 0; i < newFiles.length; i++) {
      const fileData = newFiles[i]
      await uploadFile(fileData, files.length + i)
    }
  }

  const uploadFile = async (fileData: UploadedFile, index: number) => {
    try {
      const formData = new FormData()
      formData.append("file", fileData.file)
      formData.append("userId", session?.user?.email || "")

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.file === fileData.file ? { ...f, progress: Math.min(f.progress + 10, 90) } : f)),
        )
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (response.ok) {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.file === fileData.file ? { ...f, status: "success", progress: 100 } : f)),
        )
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f) => (f.file === fileData.file ? { ...f, status: "error", progress: 0 } : f)),
      )
    }
  }

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file !== fileToRemove.file))
    URL.revokeObjectURL(fileToRemove.preview)
  }

  const handleNext = async () => {
    const successfulUploads = uploadedFiles.filter((f) => f.status === "success")

    if (successfulUploads.length < 6) {
      alert("Upload minimaal 6 foto's om door te gaan.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/wizard/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: "upload",
          data: {
            uploadedFiles: successfulUploads.length,
            userId: session?.user?.email,
          },
        }),
      })

      if (response.ok) {
        router.push("/wizard/checkout")
      }
    } catch (error) {
      console.error("Error saving upload data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/wizard/gender")
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
      </div>
    )
  }

  const successfulUploads = uploadedFiles.filter((f) => f.status === "success").length

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Progress value={100} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">Stap 3 van 3</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Upload je foto's</h1>

          <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Upload minimaal 6 foto's van jezelf. Zorg voor goede belichting en verschillende poses voor de beste
            resultaten.
          </p>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              isDragOver ? "border-[#FF8C00] bg-[#FF8C00]/5" : "border-gray-300 hover:border-[#FF8C00]/50"
            }`}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Sleep je foto's hierheen of klik om te selecteren</p>
            <p className="text-sm text-gray-500 mb-4">Ondersteunde formaten: JPG, PNG, WEBP (max 10MB per foto)</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button
              asChild
              variant="outline"
              className="border-[#FF8C00] text-[#FF8C00] hover:bg-[#FF8C00] hover:text-white bg-transparent"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                Selecteer Foto's
              </label>
            </Button>
          </div>

          {/* Upload Status */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Geüploade foto's: {successfulUploads}/6 minimum</p>
            <Progress value={(successfulUploads / 6) * 100} className="h-2" />
          </div>

          {/* Uploaded Files Grid */}
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {uploadedFiles.map((fileData, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                    <Image
                      src={fileData.preview || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Status Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      {fileData.status === "uploading" && (
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                          <p className="text-xs">{fileData.progress}%</p>
                        </div>
                      )}
                      {fileData.status === "success" && <Check className="h-8 w-8 text-green-400" />}
                      {fileData.status === "error" && <X className="h-8 w-8 text-red-400" />}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(fileData)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Tips voor de beste resultaten:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload foto's met goede belichting (geen schaduwen op je gezicht)</li>
              <li>• Varieer je poses en gezichtsuitdrukkingen</li>
              <li>• Zorg dat je gezicht duidelijk zichtbaar is</li>
              <li>• Gebruik foto's van verschillende dagen</li>
              <li>• Vermijd groepsfoto's of foto's met zonnebrillen</li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button onClick={handleBack} variant="outline" className="flex items-center gap-2 px-6 py-3 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Terug
            </Button>

            <Button
              onClick={handleNext}
              disabled={successfulUploads < 6 || isLoading}
              className="bg-[#FF8C00] hover:bg-[#E67E00] text-white px-8 py-3 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  Naar Betaling
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
