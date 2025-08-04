"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Check, Star, Users, Camera, Zap } from "lucide-react"
import { Header } from "@/components/header"

export default function StartPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGetStarted = async () => {
    setLoading(true)

    if (!session) {
      await signIn("google")
      return
    }

    // User is logged in, go to wizard
    router.push("/wizard/welcome")
  }

  // If user is already logged in, redirect to wizard
  if (session && status === "authenticated") {
    router.push("/wizard/welcome")
    return null
  }

  const features = [
    {
      icon: Camera,
      title: "Upload je foto's",
      description: "Upload 6-10 foto's van jezelf vanuit verschillende hoeken",
    },
    {
      icon: Zap,
      title: "AI doet de magie",
      description: "Onze AI genereert 40 professionele headshots in 15 minuten",
    },
    {
      icon: Users,
      title: "Download & gebruik",
      description: "Download je foto's en gebruik ze voor LinkedIn, CV, website",
    },
  ]

  const testimonials = [
    {
      name: "Sarah van der Berg",
      role: "Marketing Manager",
      content: "Geweldige kwaliteit! Precies wat ik nodig had voor mijn LinkedIn profiel.",
      rating: 5,
    },
    {
      name: "Mark Janssen",
      role: "Consultant",
      content: "Supersnel en professioneel. Bespaard me een dure fotoshoot.",
      rating: 5,
    },
    {
      name: "Lisa de Vries",
      role: "Ondernemer",
      content: "Ik ben onder de indruk van de kwaliteit. Echt professionele foto's!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 mr-2" />
            Meer dan 10.000+ tevreden gebruikers
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professionele headshots
            <br />
            <span className="text-[#0077B5]">in 15 minuten</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Geen dure fotostudio nodig. Upload je foto's, kies je stijl, en krijg 40 professionele headshots voor
            slechts €19,99.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={loading}
              className="bg-[#FF8C00] hover:bg-[#FFA500] text-white px-8 py-4 text-lg font-semibold"
            >
              {loading ? "Bezig..." : "Start nu gratis"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Geen creditcard vereist
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>4.9/5 sterren</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>10.000+ tevreden klanten</span>
            </div>
          </div>
        </div>

        {/* Photo Examples */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              "/images/professional-man-1.jpg",
              "/images/professional-woman-1.jpg",
              "/images/professional-man-2.jpg",
              "/images/professional-woman-2.jpg",
            ].map((photo, index) => (
              <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Professional headshot example ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Zo werkt het</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-[#0077B5] rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Wat onze klanten zeggen</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-[#0077B5] to-[#004182] rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join duizenden professionals die al hun perfecte headshot hebben gevonden
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            disabled={loading}
            className="bg-[#FF8C00] hover:bg-[#FFA500] text-white px-8 py-4 text-lg font-semibold"
          >
            {loading ? "Bezig..." : "Start nu gratis"} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="mt-4 text-sm opacity-75">Betaal pas na het uploaden van je foto's</div>
        </div>
      </div>
    </div>
  )
}
