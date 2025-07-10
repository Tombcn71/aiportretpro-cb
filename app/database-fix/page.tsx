"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Database, CheckCircle, Wrench } from "lucide-react"

export default function DatabaseFixPage() {
  const [schemaCheck, setSchemaCheck] = useState<any>(null)
  const [fixResult, setFixResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkSchema = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/database/check-schema")
      const data = await response.json()
      setSchemaCheck(data)
    } catch (error) {
      setSchemaCheck({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const fixSchema = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/database/fix-schema", {
        method: "POST",
      })
      const data = await response.json()
      setFixResult(data)
      // Refresh schema check after fix
      await checkSchema()
    } catch (error) {
      setFixResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-red-600">🔧 Database Schema Fix</h1>

        <div className="grid gap-6">
          {/* Actions */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <Database className="h-6 w-6" />
                <span>Database Diagnostics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={checkSchema} disabled={loading} variant="outline" size="lg">
                  <Database className="h-4 w-4 mr-2" />
                  1. Check Database Schema
                </Button>

                <Button
                  onClick={fixSchema}
                  disabled={loading || !schemaCheck}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  2. Fix Database Issues
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schema Check Results */}
          {schemaCheck && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {schemaCheck.error ? (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-blue-500" />
                  )}
                  <span>Database Schema Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {schemaCheck.error ? (
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-red-800 font-semibold">Database Error:</p>
                    <p className="text-red-700">{schemaCheck.error}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Schema Issues */}
                    {schemaCheck.schema_issues && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Schema Issues Found:</h3>
                        <div className="space-y-2">
                          {schemaCheck.schema_issues.missing_columns?.length > 0 && (
                            <div>
                              <span className="font-medium">Missing columns:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {schemaCheck.schema_issues.missing_columns.map((col: string) => (
                                  <Badge key={col} variant="destructive">
                                    {col}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {schemaCheck.schema_issues.wrong_data_types?.length > 0 && (
                            <div>
                              <span className="font-medium">Data type issues:</span>
                              <ul className="list-disc list-inside text-sm mt-1">
                                {schemaCheck.schema_issues.wrong_data_types.map((issue: string, i: number) => (
                                  <li key={i}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Projects Data Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {schemaCheck.projects_data?.total_projects || 0}
                        </div>
                        <div className="text-sm text-blue-800">Total Projects</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {schemaCheck.projects_data?.projects_with_photos || 0}
                        </div>
                        <div className="text-sm text-green-800">With Photos</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {schemaCheck.projects_data?.projects_with_prediction_id || 0}
                        </div>
                        <div className="text-sm text-purple-800">With Astria ID</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {schemaCheck.database_status?.projects_columns?.length || 0}
                        </div>
                        <div className="text-sm text-gray-800">Table Columns</div>
                      </div>
                    </div>

                    {/* Sample Projects */}
                    {schemaCheck.projects_data?.sample_projects && (
                      <div>
                        <h3 className="font-semibold mb-2">Sample Projects:</h3>
                        <div className="space-y-2">
                          {schemaCheck.projects_data.sample_projects.slice(0, 5).map((project: any) => (
                            <div key={project.id} className="border rounded p-3 text-sm">
                              <div className="flex items-center justify-between">
                                <span>
                                  #{project.id} - {project.name}
                                </span>
                                <div className="flex space-x-2">
                                  <Badge variant={project.photo_count > 0 ? "default" : "secondary"}>
                                    {project.photo_count} photos
                                  </Badge>
                                  <Badge variant={project.prediction_id ? "outline" : "destructive"}>
                                    {project.prediction_id ? "Has Astria ID" : "No Astria ID"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <details className="bg-gray-50 p-3 rounded">
                      <summary className="cursor-pointer font-medium">Raw Database Info</summary>
                      <pre className="text-xs mt-2 overflow-auto max-h-96">{JSON.stringify(schemaCheck, null, 2)}</pre>
                    </details>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Fix Results */}
          {fixResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {fixResult.error ? (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  <span>Database Fix Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {fixResult.error ? (
                  <div className="bg-red-50 p-4 rounded">
                    <p className="text-red-800 font-semibold">Fix Failed:</p>
                    <p className="text-red-700">{fixResult.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded">
                      <h3 className="font-semibold text-green-800 mb-2">✅ Database Fixed!</h3>
                      <ul className="space-y-1 text-sm">
                        {fixResult.fixes_applied?.map((fix: string, i: number) => (
                          <li key={i} className={fix.includes("❌") ? "text-red-700" : "text-green-700"}>
                            {fix}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {fixResult.verification && (
                      <div className="bg-blue-50 p-4 rounded">
                        <h3 className="font-semibold text-blue-800 mb-2">Verification:</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Total projects: {fixResult.verification.total_projects}</div>
                          <div>Has photos column: {fixResult.verification.has_photos_column}</div>
                          <div>Has prediction ID: {fixResult.verification.has_prediction_id}</div>
                          <div>Has updated_at: {fixResult.verification.has_updated_at}</div>
                        </div>
                      </div>
                    )}

                    <div className="bg-yellow-50 p-4 rounded">
                      <h3 className="font-semibold text-yellow-800 mb-2">Next Steps:</h3>
                      <ol className="list-decimal list-inside text-sm space-y-1">
                        {fixResult.next_steps?.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                        <li>
                          <strong>
                            Go to{" "}
                            <a href="/debug-fix" className="text-blue-600 underline">
                              /debug-fix
                            </a>{" "}
                            to recover your photos
                          </strong>
                        </li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
