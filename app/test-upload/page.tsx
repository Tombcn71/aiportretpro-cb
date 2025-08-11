"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"

export default function TestUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    const file = files[0]
    if (file.type.startsWith("image/")) {
      setUploadedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      
      if (result.url) {
        setUploadedUrl(result.url)
        console.log("Uploaded URL:", result.url)
      } else {
        console.error("Upload failed:", result.error)
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Upload - Screenshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline">
                  Selecteer Screenshot
                </Button>
              </label>
            </div>

            {uploadedFile && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Geselecteerd: {uploadedFile.name}
                </p>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? "Uploaden..." : "Upload Screenshot"}
                </Button>
              </div>
            )}

            {uploadedUrl && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">Upload succesvol!</p>
                <p className="text-sm text-green-600 break-all">{uploadedUrl}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 