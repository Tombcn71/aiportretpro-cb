"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { trackInitiateCheckout } from "@/lib/facebook-pixel"

export default function PricingSection() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
    <section id="prijzen" className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Eenvoudige Prijzen</h2>
          <p className="text-xl text-gray-600">Alles wat je nodig hebt voor professionele portretfoto's</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="relative border-2 border-[#0077B5] shadow-xl">
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-bold">Professional</CardTitle>
              <div className="mt-4">
                <span className="text-2xl md:text-4xl font-bold text-[#0077B5]">€19,99</span>
              </div>
              <p className="text-gray-600 mt-2">40 professionele portretfoto's</p>
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
                {loading ? "Laden..." : "Betaal Veilig & Start Direct"}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>✓ Veilige betaling met ideal en credit card</p>
                <p>✓ Geld terug garantie</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
