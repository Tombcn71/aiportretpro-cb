"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DebugData {
  tableExists: boolean
  userId: number
  userEmail: string
  userCredits: any
  allCredits: any[]
  purchases: any[]
}

export default function DebugCreditsPage() {
  const [data, setData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/debug/credits")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching debug data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTestCredits = async () => {
    try {
      const response = await fetch("/api/credits/add-test", { method: "POST" })
      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error adding test credits:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  if (!data) return <div>Error loading data</div>

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Credits Debug</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>User ID:</strong> {data.userId}
          </p>
          <p>
            <strong>Email:</strong> {data.userEmail}
          </p>
          <p>
            <strong>Credits Table Exists:</strong> {data.tableExists ? "Yes" : "No"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Credits</CardTitle>
        </CardHeader>
        <CardContent>
          {data.userCredits ? (
            <div>
              <p>
                <strong>Credits:</strong> {data.userCredits.credits}
              </p>
              <p>
                <strong>Created:</strong> {new Date(data.userCredits.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Updated:</strong> {new Date(data.userCredits.updated_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <p>No credits record found for this user</p>
          )}
          <Button onClick={addTestCredits} className="mt-4">
            Add 5 Test Credits
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          {data.purchases.length > 0 ? (
            <div className="space-y-2">
              {data.purchases.map((purchase: any) => (
                <div key={purchase.id} className="border p-2 rounded">
                  <p>
                    <strong>Plan:</strong> {purchase.plan_type}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${purchase.amount}
                  </p>
                  <p>
                    <strong>Headshots:</strong> {purchase.headshots_included}
                  </p>
                  <p>
                    <strong>Status:</strong> {purchase.status}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(purchase.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No purchases found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Credits Records</CardTitle>
        </CardHeader>
        <CardContent>
          {data.allCredits.length > 0 ? (
            <div className="space-y-2">
              {data.allCredits.map((credit: any) => (
                <div key={credit.id} className="border p-2 rounded">
                  <p>
                    <strong>User:</strong> {credit.email}
                  </p>
                  <p>
                    <strong>Credits:</strong> {credit.credits}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(credit.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No credits records found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
