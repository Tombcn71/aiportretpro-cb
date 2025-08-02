"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, ArrowLeft } from "lucide-react"
import { trackViewContent, trackInitiateCheckout } from "@/lib/facebook-pixel"
import Image from "next/image"

export default function WizardCheckoutPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Track pricing page view
  useEffect(() => {
    trackViewContent("Wizard Checkout Page", 19.99)
  }, [])

  const handlePlanSelect = () => {
    // Track checkout initiation
    trackInitiateCheckout(19.99)

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
        body: JSON.stringify({
          planId: "professional",
          priceId: "price_1RrFTnDswbEJWagVnjXYvNwh",
          successUrl: `${window.location.origin}/generate/processing`,
          cancelUrl: `${window.location.origin}/wizard/checkout`,
        }),
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
    "40 professionele portretfoto's",
    "Verschillende zakelijke outfits",
    "Verschillende poses en achtergronden",
    "HD kwaliteit downloads",
    "Klaar binnen 15 minuten",
    "Perfect voor LinkedIn, Social Media, CV, Website en Print",
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left side - Photos grid */}
          <div className="space-y-8">
            <div>
              <Button variant="ghost" onClick={() => router.push("/wizard/upload")} className="mb-6 p-0 h-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Get your headshots in <span className="text-orange-500">minutes</span>, not days
              </h1>
            </div>

            {/* Photos grid - 2x4 layout */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/professional-man-1.jpg"
                  alt="Professional headshot"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/professional-woman-1.jpg"
                  alt="Professional headshot"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/professional-man-2.jpg"
                  alt="Professional headshot"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/professional-woman-2.jpg"
                  alt="Professional headshot"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/professional-man-3.jpg"
                  alt="Professional headshot"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/professional-woman-3.jpg"
                  alt="Professional headshot"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/professional-man-4.jpg"
                  alt="Professional headshot"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/professional-woman-4.jpg"
                  alt="Professional headshot"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Trustpilot */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                <Star className="w-4 h-4 text-green-500 fill-current" />
                <Star className="w-4 h-4 text-green-500 fill-current" />
                <Star className="w-4 h-4 text-green-500 fill-current" />
                <Star className="w-4 h-4 text-green-500 fill-current" />
                <Star className="w-4 h-4 text-green-500 fill-current" />
              </div>
              <span className="text-sm font-medium">Trustpilot</span>
            </div>

            {/* Testimonial */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 italic mb-4">
                "Some of my family initially worried that I was wasting time and money, but after seeing the results,
                they were amazed. I had been dreading the task of getting a great photo for my author bio in my upcoming
                book, and now that worry is gone. Thank you!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <span className="font-medium">Adam Weygandt</span>
              </div>
            </div>

            {/* Company logos */}
            <div className="space-y-4">
              <p className="text-center text-gray-600 font-medium">Trusted by teams at</p>
              <div className="flex items-center justify-center space-x-8 opacity-60 text-xs">
                <span>Trinity College</span>
                <span>NEW YORK UNIVERSITY</span>
                <span>ASU</span>
                <span>UC Berkeley</span>
                <span>Microsoft</span>
                <span>PWC</span>
              </div>
            </div>
          </div>

          {/* Right side - Pricing */}
          <div className="flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-8 text-right">
              <div className="inline-flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-lg">Aragon.ai</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">👋 Welkom! Dit is je pakket.</h1>
              <p className="text-md text-gray-600">Na een snelle en veilige betaling kun je direct aan de slag</p>
            </div>

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
      </div>
    </div>
  )
}
