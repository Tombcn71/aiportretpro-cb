"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DebugData {
  user: any
  credits: any
  recentProjects: any[]
  recentPurchases: any[]
  creditHistory: any[]
}

export default function DebugCreditsFlow() {
  const [data, setData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/credits-flow")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Debug Credits Flow</h1>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Debug Credits Flow</h1>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-800">Error: {error}</p>
              <Button onClick={fetchDebugData} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Debug Credits Flow</h1>
          <Button onClick={fetchDebugData}>Refresh Data</Button>
        </div>

        <div className="grid gap-6">
          {/* Current User & Credits */}
          <Card>
            <CardHeader>
              <CardTitle>Current User & Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">User Info:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(data?.user, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Credits Info:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(data?.credits, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects (Last 10)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Credits Used</th>
                      <th className="text-left p-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentProjects?.map((project) => (
                      <tr key={project.id} className="border-b">
                        <td className="p-2">{project.id}</td>
                        <td className="p-2">{project.name}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              project.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : project.status === "training"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {project.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`font-semibold ${project.credits_used ? "text-red-600" : "text-gray-400"}`}>
                            {project.credits_used || 0}
                          </span>
                        </td>
                        <td className="p-2">{new Date(project.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Purchases */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases (Last 10)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Stripe Session</th>
                      <th className="text-left p-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentPurchases?.map((purchase) => (
                      <tr key={purchase.id} className="border-b">
                        <td className="p-2">{purchase.id}</td>
                        <td className="p-2">€{purchase.amount}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              purchase.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : purchase.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                        <td className="p-2 font-mono text-xs">{purchase.stripe_session_id?.substring(0, 20)}...</td>
                        <td className="p-2">{new Date(purchase.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Credit History */}
          <Card>
            <CardHeader>
              <CardTitle>Credit History Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Summary:</h4>
                  <div className="bg-blue-50 p-4 rounded">
                    <p>
                      <strong>Total Projects:</strong> {data?.recentProjects?.length || 0}
                    </p>
                    <p>
                      <strong>Projects with Credits Used:</strong>{" "}
                      {data?.recentProjects?.filter((p) => p.credits_used)?.length || 0}
                    </p>
                    <p>
                      <strong>Total Purchases:</strong> {data?.recentPurchases?.length || 0}
                    </p>
                    <p>
                      <strong>Completed Purchases:</strong>{" "}
                      {data?.recentPurchases?.filter((p) => p.status === "completed")?.length || 0}
                    </p>
                    <p>
                      <strong>Current Credits:</strong> {data?.credits?.credits || 0}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Potential Issues:</h4>
                  <div className="space-y-2">
                    {data?.recentProjects?.some((p) => !p.credits_used) && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded">
                        <p className="text-red-800">⚠️ Found projects without credits_used flag</p>
                      </div>
                    )}

                    {data?.recentPurchases?.some((p) => p.status !== "completed") && (
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                        <p className="text-yellow-800">⚠️ Found incomplete purchases</p>
                      </div>
                    )}

                    {(data?.credits?.credits || 0) > 10 && (
                      <div className="bg-orange-50 border border-orange-200 p-3 rounded">
                        <p className="text-orange-800">⚠️ Unusually high credit balance</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
