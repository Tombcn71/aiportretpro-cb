"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleGetStarted = () => {
    if (session) {
      router.push("/wizard/welcome")
    } else {
      router.push("/auth/signin?callbackUrl=/wizard/welcome")
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Professional Headshots
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Professionele <span className="text-orange-500">AI Headshots</span> in 20 minuten
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Upload je foto's, betaal eenmalig €29, en ontvang 40 professionele headshots perfect voor LinkedIn, CV's
                en bedrijfsprofielen.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">40 professionele foto's</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Klaar binnen 20 minuten</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Hoge resolutie (1024x1024)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Eenmalige betaling</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              >
                Start Nu - €29
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 transition-all duration-200"
              >
                Hoe werkt het?
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Veilige betaling via Stripe
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Geen abonnement
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Direct downloadbaar
              </div>
            </div>
          </div>

          {/* Right content - Before/After showcase */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {/* Before */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Image
                      src="/images/before-casual.jpg"
                      alt="Voor - Casual foto"
                      width={200}
                      height={200}
                      className="rounded-xl mx-auto"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Voor
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <ArrowRight className="w-8 h-8 text-orange-500" />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                      AI Magic
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="text-center -ml-6">
                  <div className="relative mb-4">
                    <Image
                      src="/images/after-professional.jpg"
                      alt="Na - Professionele headshot"
                      width={200}
                      height={200}
                      className="rounded-xl mx-auto"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Na
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">Van casual foto naar professionele headshot in 20 minuten</p>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-full shadow-lg border">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
