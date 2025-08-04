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
  }
  projects: {
    total: number
    completed: number
    creditsUsed: number
    available: number
  }
  analysis: {
    problemDetected: boolean
    message: string
  }
  recentProjects: Array<{
    id: number
    name: string
    status: string
    creditsUsed: number
    date: string
  }>
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
      console.error("Error fetching credit flow:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading credit analysis...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error loading data</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Credit Flow Debug
            <Button onClick={fetchData} variant="outline" size="sm">
              Refresh Data
            </Button>
          </CardTitle>
          <p className="text-sm text-gray-600">Analyseer hoe credits werken zonder iets te veranderen</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>User ID:</strong> {data.user.id}
            </div>
            <div>
              <strong>Email:</strong> {data.user.email}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credits Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>Current Credits:</strong> {data.credits.current}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date(data.credits.lastUpdated).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

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
              <div className="text-2xl font-bold">{data.projects.creditsUsed}</div>
              <div className="text-sm text-gray-600">Credits Used in Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.projects.available}</div>
              <div className="text-sm text-gray-600">Available Credits</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <div className="font-medium">🔍 Problem Detection:</div>
            <div className={data.analysis.problemDetected ? "text-red-600" : "text-green-600"}>
              {data.analysis.message}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-600">(ID: {project.id})</div>
                  </div>
                  <Badge
                    variant={
                      project.status === "completed"
                        ? "default"
                        : project.status === "training"
                          ? "secondary"
                          : project.status === "failed"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-medium">Credits used: {project.creditsUsed}</div>
                  <div className="text-sm text-gray-600">{project.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
