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
  const [wizardData, setWizardData] = useState<any>(null)
  const router = useRouter()

  // Track pricing page view
  useEffect(() => {
    trackViewContent("Wizard Checkout Page", 19.99)
  }, [])

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    // Check if we have ALL wizard data
    const projectName = localStorage.getItem("wizard_project_name")
    const gender = localStorage.getItem("wizard_gender")
    const uploadedPhotos = localStorage.getItem("wizard_uploaded_photos")

    console.log("🧙‍♂️ Checking wizard data:", {
      projectName: !!projectName,
      gender: !!gender,
      photosLength: uploadedPhotos ? JSON.parse(uploadedPhotos).length : 0,
    })

    if (!projectName || !gender || !uploadedPhotos) {
      console.error("❌ Missing wizard data, redirecting to start")
      router.push("/wizard/project-name")
      return
    }

    const parsedPhotos = JSON.parse(uploadedPhotos)
    if (parsedPhotos.length < 4) {
      console.error("❌ Not enough photos, redirecting to upload")
      router.push("/wizard/upload")
      return
    }

    setWizardData({
      projectName,
      gender,
      uploadedPhotos: parsedPhotos,
    })

    console.log("✅ Wizard data loaded successfully")
  }, [session, router])

  const handlePlanSelect = () => {
    // Track checkout initiation
    trackInitiateCheckout(19.99)
    handleCheckout()
  }

  const handleCheckout = async () => {
    if (!session?.user?.email || !wizardData) {
      console.error("❌ Missing session or wizard data")
      return
    }

    setLoading(true)

    try {
      console.log("🛒 Starting checkout process...")
      console.log("👤 User email:", session.user.email)
      console.log("🧙‍♂️ Wizard data:", {
        projectName: wizardData.projectName,
        gender: wizardData.gender,
        photoCount: wizardData.uploadedPhotos.length,
      })

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
          customer_email: session.user.email,
          metadata: {
            flow: "wizard",
            projectName: wizardData.projectName,
            gender: wizardData.gender,
            uploadedPhotos: JSON.stringify(wizardData.uploadedPhotos),
          },
        }),
      })

      console.log("📡 Checkout response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Checkout response error:", errorText)
        throw new Error(`Checkout failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ Checkout data received:", data)

      if (data.url) {
        console.log("🔗 Redirecting to Stripe checkout:", data.url)
        window.location.href = data.url
      } else {
        console.error("❌ No checkout URL in response")
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("❌ Checkout error:", error)
      alert("Er is een fout opgetreden. Probeer het opnieuw.")
    } finally {
      setLoading(false)
    }
  }

  if (!wizardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
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
