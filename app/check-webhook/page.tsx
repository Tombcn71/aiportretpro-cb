"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function CheckWebhookPage() {
  const [tuneId, setTuneId] = useState("2955915")
  const [webhookInfo, setWebhookInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/astria/check-webhook?tune_id=${tuneId}`)
      const data = await response.json()
      setWebhookInfo(data)
    } catch (error) {
      console.error("Error checking webhook:", error)
      setWebhookInfo({ error: "Failed to check webhook" })
    } finally {
      setLoading(false)
    }
  }

  const correctWebhookUrl = `https://www.aiportretpro.nl/api/astria/prompt-webhook?user_id=1&model_id=${tuneId}&webhook_secret=shadf892yr32548hq23h`

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Check Astria Webhook Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="tuneId">Tune ID</Label>
            <Input
              id="tuneId"
              value={tuneId}
              onChange={(e) => setTuneId(e.target.value)}
              placeholder="Enter tune ID (e.g., 2955915)"
              className="mt-1"
            />
          </div>

          <Button onClick={checkWebhook} disabled={loading} className="w-full">
            {loading ? "Checking..." : "Check Webhook Configuration"}
          </Button>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">✅ Correct Webhook URL:</h3>
              <div className="p-3 bg-white rounded border text-sm break-all font-mono">{correctWebhookUrl}</div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-3">📋 How to set webhook in Astria:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                <li>
                  Go to{" "}
                  <a
                    href="https://www.astria.ai/tunes"
                    target="_blank"
                    className="text-blue-600 underline font-medium"
                    rel="noreferrer"
                  >
                    astria.ai/tunes
                  </a>
                </li>
                <li>
                  Find your tune with ID: <Badge variant="outline">{tuneId}</Badge>
                </li>
                <li>Click on the tune to open its details</li>
                <li>
                  Look for <strong>"Webhook URL"</strong> or <strong>"Callback URL"</strong> field
                </li>
                <li>Copy and paste the correct URL from above</li>
                <li>Save the changes</li>
              </ol>
            </div>

            {webhookInfo && (
              <div className="space-y-4">
                {webhookInfo.success ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Tune Found Successfully</h3>
                    </div>
                    <div className="text-sm text-green-800">
                      <p>
                        <strong>Tune ID:</strong> {webhookInfo.tuneId}
                      </p>
                      <p>
                        <strong>Title:</strong> {webhookInfo.tuneData?.title || "N/A"}
                      </p>
                      <p>
                        <strong>Status:</strong> {webhookInfo.tuneData?.status || "N/A"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">Error</h3>
                    </div>
                    <p className="text-sm text-red-800">{webhookInfo.error}</p>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Raw Response:</h3>
                  <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-64">
                    {JSON.stringify(webhookInfo, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">🔧 Next Steps:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                <li>Set the webhook URL in Astria (see instructions above)</li>
                <li>Test with a small generation (1-2 photos to save costs)</li>
                <li>Monitor server logs for incoming webhooks</li>
                <li>Check your dashboard for new photos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
