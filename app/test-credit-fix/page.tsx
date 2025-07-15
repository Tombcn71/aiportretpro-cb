"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestCreditFix() {
  const [projectId, setProjectId] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testFix = async (dryRun: boolean) => {
    if (!projectId) {
      alert("Vul een project ID in")
      return
    }

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
      console.error("Test failed:", error)
      setResult({ error: "Test failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Test Credit Fix</h1>
      <p className="text-gray-600">Test credit deductie voor een specifiek project</p>

      <Card>
        <CardHeader>
          <CardTitle>Test Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="projectId">Project ID</Label>
            <Input
              id="projectId"
              type="number"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Bijv. 48"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => testFix(true)} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Dry Run (Geen Changes)"}
            </Button>
            <Button onClick={() => testFix(false)} disabled={loading} variant="destructive">
              {loading ? "Testing..." : "Echte Fix (PAS OP!)"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Test Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
