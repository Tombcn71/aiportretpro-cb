"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Database, Wrench, AlertTriangle } from "lucide-react"

export default function RepairDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleRepair = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/database/repair-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Network error",
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    if (success) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "training":
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "no_photos":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Database Schema Repareren</h1>
          <p className="text-gray-600">Voeg tune_id kolom toe en repareer project 40</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Schema Reparatie
            </CardTitle>
            <CardDescription>Dit voegt de tune_id kolom toe en update project 40 met de juiste waarden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Wat er gebeurt:
                </h4>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Voegt tune_id kolom toe aan projects tabel</li>
                  <li>• Maakt index voor betere performance</li>
                  <li>• Update project 40 met tune_id = prediction_id</li>
                  <li>• Controleert alle projecten</li>
                </ul>
              </div>

              <Button onClick={handleRepair} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Bezig met repareren...
                  </>
                ) : (
                  <>
                    <Wrench className="h-4 w-4 mr-2" />
                    Repareer Database Schema
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(result.success)}
                Reparatie Resultaat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Reparatie Succesvol!
                    </h3>
                    <p className="text-green-700">{result.message}</p>
                  </div>

                  {result.changes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Uitgevoerde Wijzigingen:</h4>
                      <ul className="text-blue-700 space-y-1">
                        {result.changes.map((change: string, index: number) => (
                          <li key={index}>• {change}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.updatedProjects && result.updatedProjects.length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Bijgewerkte Projecten:</h4>
                      {result.updatedProjects.map((project: any, index: number) => (
                        <div key={index} className="text-sm text-purple-700">
                          Project {project.id} ({project.name}): tune_id = {project.tune_id}
                        </div>
                      ))}
                    </div>
                  )}

                  {result.allProjects && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Alle Projecten Status:</h4>
                      <div className="space-y-2">
                        {result.allProjects.map((project: any, index: number) => (
                          <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                            <div>
                              <span className="font-medium">Project {project.id}</span>
                              <span className="text-gray-600 ml-2">({project.name})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                              <Badge variant="outline">{project.photo_status}</Badge>
                              <span className="text-xs text-gray-500">tune_id: {project.tune_id || "null"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Volgende Stappen:</h4>
                    <ol className="list-decimal list-inside text-blue-700 space-y-1">
                      <li>Database schema is nu gerepareerd</li>
                      <li>Webhooks zouden nu moeten werken met tune_id</li>
                      <li>Test een nieuwe photoshoot om te controleren</li>
                      <li>
                        Voor project 40: gebruik{" "}
                        <a href="/manual-fetch" className="underline font-medium">
                          manual fetch
                        </a>{" "}
                        om foto's op te halen
                      </li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Reparatie Mislukt
                    </h3>
                    <p className="text-red-700">{result.error}</p>
                  </div>

                  {result.details && (
                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <summary className="font-semibold text-gray-800 cursor-pointer">Technische Details</summary>
                      <pre className="mt-2 text-xs text-gray-600 overflow-auto whitespace-pre-wrap">
                        {result.details}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">🎯 Waarom deze reparatie nodig is:</h3>
          <ul className="text-blue-700 space-y-2">
            <li>• Webhooks verwachten tune_id kolom voor project matching</li>
            <li>• Project 40 heeft alleen prediction_id, geen tune_id</li>
            <li>• Na reparatie werken webhooks weer automatisch</li>
            <li>• Database schema komt overeen met webhook verwachtingen</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
