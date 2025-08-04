"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, RefreshCw, Wrench } from "lucide-react"

export default function DebugFixPage() {
  const [statusResult, setStatusResult] = useState<any>(null)
  const [webhookResult, setWebhookResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkAndRecoverImages = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/astria/check-status", {
        method: "POST",
      })
      const data = await response.json()
      setStatusResult(data)
    } catch (error) {
      setStatusResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const fixWebhooks = async () => {
    try {
      const response = await fetch("/api/astria/fix-webhooks", {
        method: "POST",
      })
      const data = await response.json()
      setWebhookResult(data)
    } catch (error) {
      setWebhookResult({ error: error.message })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-red-600">🚨 Emergency Photo Recovery</h1>

        <div className="grid gap-6">
          {/* Emergency Actions */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-6 w-6" />
                <span>Immediate Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={checkAndRecoverImages}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Checking..." : "1. Check & Recover All Photos"}
                </Button>

                <Button onClick={fixWebhooks} variant="outline" size="lg">
                  <Wrench className="h-4 w-4 mr-2" />
                  2. Test Webhook Configuration
                </Button>
              </div>

              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold mb-2">What this does:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Checks all your projects directly with Astria API</li>
                  <li>• Recovers any generated photos that weren't saved</li>
                  <li>• Updates project status to "completed" if photos are found</li>
                  <li>• Tests if webhooks are working for future projects</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Status Check Results */}
          {statusResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {statusResult.error ? (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  <span>Photo Recovery Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusResult.error ? (
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-red-800 font-semibold">Error:</p>
                    <p className="text-red-700">{statusResult.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 p-4 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {statusResult.summary?.total_checked || 0}
                        </div>
                        <div className="text-sm text-blue-800">Projects Checked</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {statusResult.summary?.updated_projects || 0}
                        </div>
                        <div className="text-sm text-green-800">Projects Fixed</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {statusResult.summary?.total_images_recovered || 0}
                        </div>
                        <div className="text-sm text-purple-800">Photos Recovered</div>
                      </div>
                    </div>

                    {statusResult.results && statusResult.results.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Project Details:</h3>
                        {statusResult.results.map((result: any, index: number) => (
                          <div key={index} className="border rounded p-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                #{result.project_id} - {result.project_name}
                              </span>
                              {result.updated ? (
                                <Badge className="bg-green-100 text-green-800">
                                  ✅ {result.images_found} photos recovered
                                </Badge>
                              ) : result.error ? (
                                <Badge variant="destructive">❌ Error</Badge>
                              ) : (
                                <Badge variant="secondary">No photos yet</Badge>
                              )}
                            </div>
                            {result.error && <div className="text-red-600 text-xs mt-1">Error: {result.error}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Webhook Test Results */}
          {webhookResult && (
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration Test</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhookResult.recommendations && (
                    <div className="space-y-2">
                      {webhookResult.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          {rec.includes("✅") ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <details className="bg-gray-50 p-3 rounded">
                    <summary className="cursor-pointer font-medium">Technical Details</summary>
                    <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(webhookResult, null, 2)}</pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Run the photo recovery first to get your existing photos</li>
                <li>Check your dashboard to see if photos appeared</li>
                <li>If webhooks are broken, new projects won't work until fixed</li>
                <li>Contact support if photos are still missing after recovery</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
