"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { trackViewContent, trackInitiateCheckout } from "@/lib/facebook-pixel"

export default function PricingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Track pricing page view
  useEffect(() => {
    trackViewContent("Pricing Page", 29)
  }, [])

  const handlePlanSelect = () => {
    // Track checkout initiation
    trackInitiateCheckout(29)

    if (!session) {
      router.push(`/login?plan=professional`)
      return
    }
    handleCheckout()
  }

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: "professional" }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Er is een fout opgetreden. Probeer het opnieuw.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  const features = [
   
    "Verschillende zakelijke outfits",
    "Verschillende poses en achtergronden",
    "HD kwaliteit downloads",
    "Klaar binnen 15 minuten",
    "Perfect voor LinkedIn, Social Media, CV, Website en Print",
  ]

  return (
    <div className="min-h-screen ">
      <Header />
      <div className="container mx-auto px-4 py-22">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">👋 Welkom! Dit is je pakket.</h1>
          <p className="text-md text-gray-600">Na een snelle en veilige betaling kun je direct aan de slag</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="relative border-2 border-[#0077B5] shadow-xl">
            

            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-bold">Professional</CardTitle>
              <div className="mt-4">
                <span className="text-2xl font-bold text-[#0077B5]">€29</span>
              </div>
              <p className="text-gray-600 mt-2">40 professionele portetfotos</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handlePlanSelect}
                disabled={loading}
                className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-4 text-lg font-semibold"
              >
                {loading ? "Laden..." : "Start nu - €29"}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>✓ Veilige betaling met ideal en credit card</p>
                <p>✓ Geld terug garantie</p>
              </div>
            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  )
}
