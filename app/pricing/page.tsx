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
    trackViewContent("Pricing Page", "29")
    
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
    trackInitiateCheckout(29)

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
        
           
       
        <div className="text-center mb-8 max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
Je fotoshoot online doen via ons is            <span className="text-[#0077B5]"> 6x goedkoper</span> dan bij een fotograaf
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            De prijzen van een zakelijke fotoshoot in Nederland zijn gemiddeld €175. 
            <a href="/blog/zakelijke-fotoshoot-kosten-nederland" className="text-[#0077B5] hover:text-[#005885] underline font-medium">
              We hebben hiervoor 387 fotografen onderzocht
            </a> in de 10 grootste Nederlandse steden.
          </p>
        </div>
            
        
        </div>

        <div className="max-w-md mx-auto px-4 md:px-0">
          <Card className="relative border-2 border-[#0077B5] shadow-xl">
            <CardHeader className="text-center pt-6 md:pt-8 px-4 md:px-6">
              <CardTitle className="text-xl md:text-2xl font-bold">Professional</CardTitle>
              <div className="mt-4">
                <span className="text-2xl md:text-4xl font-bold text-[#0077B5]">€29</span>
              </div>
              <p className="text-gray-600 mt-2">40 professionele portretfoto's</p>
            </CardHeader>

            <CardContent className="space-y-6 px-4 md:px-6 pb-6 md:pb-8">
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
                className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-3 md:py-4 text-base md:text-lg font-semibold"
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
