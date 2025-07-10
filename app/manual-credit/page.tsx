"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ManualCreditPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const addCredit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/credits/manual-add", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        setResult("✅ 1 credit added!")
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Manual Credit Add</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={addCredit} disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add 1 Credit"}
          </Button>

          {result && <div className="p-3 bg-gray-100 rounded">{result}</div>}

          <div className="text-sm text-gray-600">
            <p>This manually adds 1 credit to your account.</p>
            <p>Use this if the webhook isn't working.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
