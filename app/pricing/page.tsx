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
  const [projectData, setProjectData] = useState<any>(null)
  const [hasExistingProject, setHasExistingProject] = useState(false)
  const router = useRouter()

  // Track pricing page view
  useEffect(() => {
    trackViewContent("Pricing Page", "19.99")
    
    // Get project data from localStorage
    const pendingProject = localStorage.getItem("pendingProject")
    if (pendingProject) {
      const projectData = JSON.parse(pendingProject)
      setProjectData(projectData)
      setHasExistingProject(true)
      
      // If it's a temporary project ID, we'll create the real project after payment
      if (projectData.projectId && typeof projectData.projectId === "string" && projectData.projectId.startsWith("temp_")) {
        console.log("Using temporary project ID, will create real project after payment")
      }
    } else {
      // No pending project - user came directly after login
      // This is fine, they can pay first and then go through the wizard
      setHasExistingProject(false)
      console.log("No pending project - user will pay first, then go through wizard")
    }
    
    // Return undefined (no cleanup function needed)
    return undefined
  }, [router])

  const handlePlanSelect = () => {
    // Track checkout initiation
    trackInitiateCheckout(19.99)

    if (!session) {
      // Redirect to login with callback to payment page
      router.push(`/login?callbackUrl=/payment`)
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
          projectId: projectData?.projectId 
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
    "5 Verschillende zakelijke outfits",
    "5 Verschillende poses en achtergronden",
    "HD kwaliteit downloads",
    "Klaar binnen 15 minuten",
    "Perfect voor LinkedIn, Social Media, CV, Website en Print",
  ]

  return (
    <div className="min-h-screen ">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-6">
          {hasExistingProject ? (
            <>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">🎉 Je foto's zijn geüpload!</h1>
              <p className="text-md text-gray-600">Nu nog een snelle betaling en je krijgt je professionele headshots</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2"> Bespaar zeker 75% op fotograaf en studio kosten</h1>
              <p className="text-md text-gray-600"> De prijzen van een professionele portretfoto fotoshoot in NL beginnen vanaf ongeveer €100-€250 .

</p>
            </>
          )}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
