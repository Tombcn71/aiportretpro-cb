"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Download, Loader2 } from "lucide-react"

export default function RescuePhotosPage() {
  const [projectId, setProjectId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRescue = async () => {
    if (!projectId.trim()) {
      setError("Please enter a project ID")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/astria/manual-rescue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: Number.parseInt(projectId) }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Rescue failed")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <Download className="h-5 w-5" />🚑 Photo Rescue Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Als een project training heeft voltooid maar geen foto's heeft ontvangen, kun je hier handmatig de foto's
              ophalen van Astria.
            </p>

            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID</Label>
              <Input
                id="projectId"
                type="number"
                placeholder="Bijv. 123"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button onClick={handleRescue} disabled={loading || !projectId.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Foto's Ophalen...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Rescue Foto's
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Error:</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <Download className="h-5 w-5" />
                <span className="font-medium">Success!</span>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Message:</strong> {result.message}
                </p>
                <p>
                  <strong>Images Found:</strong> {result.imagesCount}
                </p>
                <p>
                  <strong>Prompts Checked:</strong> {result.promptsCount}
                </p>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Foto's zijn succesvol toegevoegd aan het project. Check het dashboard om ze te zien!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hoe te gebruiken:</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              1. Ga naar <code>/emergency-webhook-debug</code> om projecten zonder foto's te vinden
            </p>
            <p>2. Kopieer het Project ID van een project dat training heeft voltooid</p>
            <p>3. Plak het hier en klik "Rescue Foto's"</p>
            <p>4. Check het dashboard om de opgehaalde foto's te zien</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
