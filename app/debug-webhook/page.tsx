"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Purchase {
  id: number
  user_id: number
  stripe_session_id: string
  status: string
  created_at: string
  email: string
  credits: number
}

export default function DebugWebhookPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/debug/webhook-logs")
        const data = await response.json()
        setPurchases(data.purchases || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Webhook Debug</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="border p-4 rounded">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Email:</strong> {purchase.email}
                  </div>
                  <div>
                    <strong>Status:</strong> {purchase.status}
                  </div>
                  <div>
                    <strong>Credits:</strong> {purchase.credits || 0}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(purchase.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
