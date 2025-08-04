"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function FixCreditsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fixCredits = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/fix-credits", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Failed to fix credits")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Fix Credits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This will fix your credits by setting them to 5 (for your 5 purchases) and marking all pending purchases as
            completed.
          </p>

          <Button onClick={fixCredits} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fixing Credits...
              </>
            ) : (
              "Fix My Credits"
            )}
          </Button>

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                <CheckCircle className="h-5 w-5" />
                Success!
              </div>
              <p className="text-green-700">{result.message}</p>
              <div className="mt-2 text-sm text-green-600">
                <p>Credits: {result.credits?.credits}</p>
                <p>Purchases updated: {result.purchasesUpdated}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                <AlertCircle className="h-5 w-5" />
                Error
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="pt-4">
              <Button asChild className="w-full">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
