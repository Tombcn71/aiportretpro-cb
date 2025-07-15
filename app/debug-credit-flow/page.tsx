"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CreditFlowData {
  user: {
    id: number
    email: string
  }
  credits: {
    current: number
    lastUpdated: string
    totalUsed: number
  }
  projects: {
    total: number
    completed: number
    list: Array<{
      id: number
      name: string
      status: string
      creditsUsed: number
      date: string
    }>
  }
  analysis: {
    problemDetected: boolean
    availableCredits: number
    shouldHaveUsed: number
  }
}

export default function DebugCreditFlow() {
  const [data, setData] = useState<CreditFlowData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/credit-flow")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch credit flow data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading credit analysis...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">Failed to load data</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Credit Flow Debug</h1>
        <Button onClick={fetchData}>Refresh Data</Button>
      </div>

      <p className="text-gray-600">Analyseer hoe credits werken zonder iets te veranderen</p>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>User ID:</strong> {data.user.id}
          </p>
          <p>
            <strong>Email:</strong> {data.user.email}
          </p>
        </CardContent>
      </Card>

      {/* Credits Status */}
      <Card>
        <CardHeader>
          <CardTitle>Credits Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-green-600">Current Credits: {data.credits.current}</div>
          <p>
            <strong>Last Updated:</strong> {new Date(data.credits.lastUpdated).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Credit Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{data.projects.total}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.projects.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.credits.totalUsed}</div>
              <div className="text-sm text-gray-600">Credits Used in Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.analysis.availableCredits}</div>
              <div className="text-sm text-gray-600">Available Credits</div>
            </div>
          </div>

          {/* Problem Detection */}
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <h3 className="font-bold text-red-800">🔍 Problem Detection:</h3>
            {data.analysis.problemDetected ? (
              <p className="text-red-700">
                ❌ Credits worden NIET afgetrokken! Je hebt {data.projects.completed} voltooide projecten maar slechts{" "}
                {data.credits.totalUsed} credits gebruikt.
              </p>
            ) : (
              <p className="text-green-700">✅ Credits lijken correct te worden afgetrokken van projecten.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.projects.list.slice(0, 20).map((project) => (
              <div key={project.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <strong>{project.name}</strong> (ID: {project.id})
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={project.status === "completed" ? "default" : "secondary"}>{project.status}</Badge>
                  <span className={project.creditsUsed > 0 ? "text-green-600" : "text-red-600"}>
                    Credits used: {project.creditsUsed}
                  </span>
                  <span className="text-gray-500 text-sm">{new Date(project.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
