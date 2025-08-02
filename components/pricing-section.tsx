"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"
import { trackViewContent, trackInitiateCheckout } from "@/lib/facebook-pixel"

const plan = {
  id: "professional",
  name: "Professional",
  price: 19.99,
  features: [
    "40 professionele portretfoto's",
    "Verschillende zakelijke outfits",
    "Verschillende poses en achtergronden",
    "HD kwaliteit downloads",
    "Klaar binnen 15 minuten",
    "Perfect voor LinkedIn, Social Media, CV, Website en Print",
  ],
}

export default function PricingSection() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePlanSelect = () => {
    trackViewContent(plan.price, "EUR")
    trackInitiateCheckout(plan.price, "EUR")

    // Always go to start page for new flow
    router.push("/start")
  }

  return (
    <section id="prijzen" className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Eenvoudige Prijzen</h2>
          <p className="text-xl text-gray-600">Alles wat je nodig hebt voor professionele portretfoto's</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-[#0077B5] relative overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl font-bold text-[#0077B5]">€{plan.price}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Betaal Veilig & Start Direct</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Veilige betaling met ideal en credit card</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Geld terug garantie</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-[#0077B5] hover:bg-[#005885] text-white py-4 text-lg font-semibold"
                onClick={handlePlanSelect}
                disabled={isLoading}
              >
                {isLoading ? "Bezig..." : "Start Nu"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
