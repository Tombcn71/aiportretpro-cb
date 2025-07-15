"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestCreditFix() {
  const [projectId, setProjectId] = useState("48")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testFix = async (dryRun: boolean) => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/test-credit-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: Number.parseInt(projectId), dryRun }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error testing fix:", error)
      setResult({ error: "Failed to test fix" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Credit Fix</CardTitle>
          <p className="text-sm text-gray-600">Test de credit fix veilig voordat we de echte code aanpassen</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Bijv. 48"
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => testFix(true)} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Dry Run (Veilig)"}
            </Button>
            <Button onClick={() => testFix(false)} disabled={loading} variant="default">
              {loading ? "Applying..." : "Echte Fix"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Test Resultaat</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
