"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  trackEvent,
  trackSignUp,
  trackPurchase,
  trackAddToCart,
  trackViewContent,
  trackLead,
  checkPixelStatus,
} from "@/lib/facebook-pixel"

export default function TestPixelPage() {
  const [pixelStatus, setPixelStatus] = useState<boolean | null>(null)
  const [events, setEvents] = useState<string[]>([])

  const addEvent = (eventName: string) => {
    setEvents((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${eventName}`])
  }

  const handleCheckStatus = () => {
    const status = checkPixelStatus()
    setPixelStatus(status)
  }

  const handleTestEvent = (eventType: string) => {
    switch (eventType) {
      case "signup":
        trackSignUp()
        addEvent("CompleteRegistration")
        break
      case "purchase":
        trackPurchase(29.99, "EUR")
        addEvent("Purchase (€29.99)")
        break
      case "addtocart":
        trackAddToCart(19.99, "EUR")
        addEvent("AddToCart (€19.99)")
        break
      case "viewcontent":
        trackViewContent("AI Headshot Package")
        addEvent("ViewContent (AI Headshot Package)")
        break
      case "lead":
        trackLead()
        addEvent("Lead")
        break
      case "custom":
        trackEvent("CustomEvent", { test: true })
        addEvent("CustomEvent")
        break
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Facebook Pixel Test</h1>
        <p className="text-gray-600">Test of je Facebook Pixel correct werkt</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Check */}
        <Card>
          <CardHeader>
            <CardTitle>Pixel Status</CardTitle>
            <CardDescription>Controleer of de Facebook Pixel geladen is</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleCheckStatus} className="w-full">
              Check Pixel Status
            </Button>
            {pixelStatus !== null && (
              <div className="flex items-center gap-2">
                <Badge variant={pixelStatus ? "default" : "destructive"}>
                  {pixelStatus ? "✅ Pixel Loaded" : "❌ Pixel Not Found"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Events */}
        <Card>
          <CardHeader>
            <CardTitle>Test Events</CardTitle>
            <CardDescription>Test verschillende Facebook Pixel events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={() => handleTestEvent("signup")} variant="outline" className="w-full">
              Test SignUp Event
            </Button>
            <Button onClick={() => handleTestEvent("purchase")} variant="outline" className="w-full">
              Test Purchase Event
            </Button>
            <Button onClick={() => handleTestEvent("addtocart")} variant="outline" className="w-full">
              Test AddToCart Event
            </Button>
            <Button onClick={() => handleTestEvent("viewcontent")} variant="outline" className="w-full">
              Test ViewContent Event
            </Button>
            <Button onClick={() => handleTestEvent("lead")} variant="outline" className="w-full">
              Test Lead Event
            </Button>
            <Button onClick={() => handleTestEvent("custom")} variant="outline" className="w-full">
              Test Custom Event
            </Button>
          </CardContent>
        </Card>

        {/* Event Log */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Event Log</CardTitle>
            <CardDescription>Overzicht van geteste events</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-gray-500 italic">Nog geen events getest...</p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {events.map((event, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {event}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Hoe te controleren</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Browser Console</h4>
              <p className="text-sm text-gray-600">
                Open Developer Tools (F12) → Console tab. Je zou berichten moeten zien zoals "✅ Facebook Pixel loaded"
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Facebook Events Manager</h4>
              <p className="text-sm text-gray-600">
                Ga naar Facebook Business Manager → Events Manager → Test Events om real-time events te zien
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Facebook Pixel Helper (Chrome Extension)</h4>
              <p className="text-sm text-gray-600">
                Installeer de Facebook Pixel Helper extensie om te zien of de pixel correct werkt
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
