"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function TestSetupPage() {
  const [setupData, setSetupData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await fetch("/api/test-setup")
        const data = await response.json()
        setSetupData(data)
      } catch (error) {
        console.error("Error checking setup:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSetup()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Setup Check</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {setupData?.ready_for_photoshoot ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <span>
                {setupData?.ready_for_photoshoot ? "✅ Ready for Photoshoot!" : "❌ Not Ready - Issues Found"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Credits Available:</strong> {setupData?.user_credits || 0}
              </div>

              {setupData?.warnings?.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <strong className="text-yellow-800">Warnings:</strong>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    {setupData.warnings.map((warning: string, index: number) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Configuration Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(setupData?.checks || {}).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  {value ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {key.replace(/_/g, " ").toUpperCase()}: {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          {setupData?.ready_for_photoshoot ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  🎉 Everything looks good! You can safely start a photoshoot.
                </p>
                <p className="text-green-700 text-sm mt-2">
                  Photos will automatically appear in your dashboard when ready.
                </p>
              </div>
              <Link href="/use-credit">
                <Button className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-3">
                  Start Photoshoot (1 Credit)
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                ⚠️ Don't start a photoshoot yet! There are configuration issues.
              </p>
              <p className="text-red-700 text-sm mt-2">Fix the warnings above first to avoid losing money.</p>
            </div>
          )}

          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
