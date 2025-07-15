"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CreditFlowData {
  user: {
    id: number
    email: string
  }
  credits: {
    credits: number
    created_at: string
    updated_at: string
  }
  projects: Array<{
    id: number
    name: string
    status: string
    credits_used: number
    created_at: string
  }>
  analysis: {
    totalProjects: number
    completedProjects: number
    creditsUsedInProjects: number
    currentCredits: number
  }
}

export default function DebugCreditFlowPage() {
  const [data, setData] = useState<CreditFlowData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCreditFlow = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/credit-flow")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch credit flow")
      }

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreditFlow()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Debug Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchCreditFlow} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Credit Flow Debug</h1>
          <p className="text-gray-600">Analyseer hoe credits werken zonder iets te veranderen</p>
          <Button onClick={fetchCreditFlow} className="mt-4">
            Refresh Data
          </Button>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>User ID:</strong> {data.user.id}
              </div>
              <div>
                <strong>Email:</strong> {data.user.email}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits Status */}
        <Card>
          <CardHeader>
            <CardTitle>Credits Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Current Credits:</strong>
                <span className="ml-2 text-2xl font-bold text-blue-600">{data.credits.credits || 0}</span>
              </div>
              <div>
                <strong>Last Updated:</strong> {data.credits.updated_at || "Never"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{data.analysis.totalProjects}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{data.analysis.completedProjects}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{data.analysis.creditsUsedInProjects}</div>
                <div className="text-sm text-gray-600">Credits Used in Projects</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{data.analysis.currentCredits}</div>
                <div className="text-sm text-gray-600">Available Credits</div>
              </div>
            </div>

            {/* Problem Detection */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-bold text-yellow-800 mb-2">🔍 Problem Detection:</h3>
              {data.analysis.creditsUsedInProjects === 0 && data.analysis.completedProjects > 0 ? (
                <p className="text-yellow-700">
                  ⚠️ PROBLEEM GEVONDEN: Je hebt {data.analysis.completedProjects} voltooide projecten, maar er zijn 0
                  credits afgetrokken. Credits worden niet correct afgetrokken bij gebruik!
                </p>
              ) : (
                <p className="text-green-700">✅ Credits lijken correct te worden afgetrokken van projecten.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.projects.length === 0 ? (
                <p className="text-gray-500">Geen projecten gevonden</p>
              ) : (
                data.projects.map((project) => (
                  <div key={project.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <strong>{project.name}</strong>
                      <span className="ml-2 text-sm text-gray-500">(ID: {project.id})</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
                          project.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : project.status === "training"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status}
                      </span>
                      <span className="text-gray-600">Credits used: {project.credits_used || 0}</span>
                      <span className="text-gray-500">{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
