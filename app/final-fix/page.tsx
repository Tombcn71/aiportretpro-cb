"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinalFixPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleFix = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/fix-all-credits", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to fix credits", details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">🔧 Final Fix</CardTitle>
          <CardDescription className="text-center">
            Get all your credits back for every purchase you made
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleFix} disabled={loading} className="w-full" size="lg">
            {loading ? "Fixing..." : "Fix All My Credits Now"}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              {result.success ? (
                <div className="text-green-800">
                  <h3 className="font-semibold">✅ Success!</h3>
                  <p>{result.message}</p>
                  <div className="mt-2 text-sm">
                    <p>Total Purchases: {result.totalPurchases}</p>
                    <p>Your Credits: {result.credits}</p>
                  </div>
                </div>
              ) : (
                <div className="text-red-800">
                  <h3 className="font-semibold">❌ Error</h3>
                  <p>{result.error}</p>
                  {result.details && <p className="text-sm mt-1">{result.details}</p>}
                </div>
              )}
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>After fixing, go to your dashboard to see your credits!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
