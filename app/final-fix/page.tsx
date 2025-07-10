"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinalFixPage() {
  const [isFixing, setIsFixing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFix = async () => {
    setIsFixing(true)
    try {
      const response = await fetch("/api/fix-all-credits", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to fix credits", details: error })
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600">🎉 FINAL FIX</CardTitle>
          <CardDescription>Get all your credits back for every project you created</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result && (
            <Button
              onClick={handleFix}
              disabled={isFixing}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isFixing ? "Fixing Credits..." : "FIX ALL MY CREDITS NOW"}
            </Button>
          )}

          {result && (
            <div className="space-y-4">
              {result.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Credits Fixed Successfully!</h3>
                  <p className="text-green-700">{result.message}</p>
                  <p className="text-green-700 font-medium">Total credits added: {result.totalCreditsAdded}</p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">❌ Error</h3>
                  <p className="text-red-700">{result.error}</p>
                  {result.details && <p className="text-red-600 text-sm mt-2">{result.details}</p>}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => (window.location.href = "/dashboard")} className="flex-1">
                  Go to Dashboard
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>This will give you 1 credit for every project you created.</p>
            <p className="mt-2 font-medium">Future purchases will now work automatically! 🎉</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
